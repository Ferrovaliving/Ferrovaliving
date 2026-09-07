import Link from "next/link";
import {logoData} from "../lib/logo-data";

export function Logo({dark=false,className=""}:{dark?:boolean;className?:string}){
  return <Link href="/" className={`brandLogo ${dark?"brandLogoDark":""} ${className}`} aria-label="Ferrova Living home"><img src={logoData} alt="Ferrova Living — Crafted for Modern Living"/></Link>
}
