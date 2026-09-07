"use client";

// Accept the project URL with or without a trailing slash or a /rest|/auth|/storage/v1 suffix.
const url=(process.env.NEXT_PUBLIC_SUPABASE_URL||"").trim().replace(/\/+$/,"").replace(/\/(rest|auth|storage)\/v1$/,"");
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
export const configured=Boolean(url&&key&&!url.includes("your-project"));
const TOKEN="ferrova_admin_session";
export type Session={access_token:string;refresh_token:string;expires_at?:number;user?:{id:string;email?:string}};
export const getSession=():Session|null=>{if(typeof window==="undefined")return null;try{return JSON.parse(localStorage.getItem(TOKEN)||"null")}catch{return null}};
export const saveSession=(s:Session|null)=>{if(s)localStorage.setItem(TOKEN,JSON.stringify(s));else localStorage.removeItem(TOKEN)};
async function refreshSession(session:Session){const res=await fetch(`${url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:session.refresh_token})});if(!res.ok){saveSession(null);throw new Error("Your session expired. Please sign in again.")}const fresh=await res.json() as Session;saveSession(fresh);return fresh}
async function getFreshSession(){const session=getSession();if(!session)return null;const expiresSoon=session.expires_at&&session.expires_at*1000<Date.now()+60_000;return expiresSoon?refreshSession(session):session}
async function request(path:string,init:RequestInit={},auth=true){let session=auth?await getFreshSession():getSession();const send=()=>fetch(`${url}${path}`,{...init,headers:{apikey:key,"Content-Type":"application/json",...(auth&&session?{Authorization:`Bearer ${session.access_token}`}:{Authorization:`Bearer ${key}`}),...init.headers}});let res=await send();if(auth&&res.status===401&&session?.refresh_token){session=await refreshSession(session);res=await send()}if(!res.ok){const e=await res.json().catch(()=>({message:res.statusText}));throw new Error(e.message||e.error_description||"Request failed")}const text=await res.text();return text?JSON.parse(text):null}
export async function signIn(email:string,password:string){const data=await request("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})},false);saveSession(data);return data as Session}
export async function resetPassword(email:string){return request("/auth/v1/recover",{method:"POST",body:JSON.stringify({email})},false)}
export function captureInviteSession(){if(typeof window==="undefined")return null;const hash=new URLSearchParams(location.hash.replace(/^#/,""));const access_token=hash.get("access_token"),refresh_token=hash.get("refresh_token");if(!access_token||!refresh_token)return null;const session={access_token,refresh_token,expires_at:Number(hash.get("expires_at")||0)};saveSession(session);return session}
export async function updatePassword(password:string){const session=getSession();if(!session)throw new Error("Invitation session is missing or expired. Request a new invitation.");return request("/auth/v1/user",{method:"PUT",body:JSON.stringify({password})},true)}
export function signOut(){saveSession(null)}
export async function list<T=Record<string,unknown>>(table:string,query=""){return request(`/rest/v1/${table}?select=*${query?`&${query}`:""}`,{},true) as Promise<T[]>}
// return=minimal: don't read the row back after inserting. Public form submissions
// run as `anon`, which has no SELECT grant on these tables, so a representation
// read-back would fail the whole request. No caller uses the returned row.
export async function insert<T>(table:string,data:Partial<T>){return request(`/rest/v1/${table}`,{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(data)}) as Promise<T[]>}
export async function update<T>(table:string,id:string|number,data:Partial<T>){return request(`/rest/v1/${table}?id=eq.${id}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(data)}) as Promise<T[]>}
export async function softDelete(table:string,id:string|number){return update(table,id,{deleted_at:new Date().toISOString()})}
export async function uploadMedia(file:File,onProgress?:(n:number)=>void){if(!/^image\/(jpeg|png|webp|avif)$/.test(file.type))throw new Error("Use JPG, PNG, WebP or AVIF");if(file.size>12*1024*1024)throw new Error("Maximum file size is 12 MB");onProgress?.(10);const path=`${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9._-]/gi,"-")}`;const session=await getFreshSession();if(!session)throw new Error("Please sign in before uploading images.");const res=await fetch(`${url}/storage/v1/object/media/${path}`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${session.access_token}`,"Content-Type":file.type,"x-upsert":"false"},body:file});if(!res.ok)throw new Error((await res.json()).message||"Upload failed");onProgress?.(85);const publicUrl=`${url}/storage/v1/object/public/media/${path}`;await insert("media",{storage_path:path,url:publicUrl,title:file.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," "),alt_text:"",mime_type:file.type,size_bytes:file.size});onProgress?.(100);return publicUrl}
