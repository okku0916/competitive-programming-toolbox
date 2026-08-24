

import type { ListConstraint, ScalarConstraint } from "@cpt/shared-types";



export function generateScalar(constraint: ScalarConstraint){
    let kind:string=constraint.kind;
    let typename:string=constraint.typeName;
    let name:string=constraint.name;
    let min:number=constraint.min;
    let max:number=constraint.max;
    let options:string[]=constraint.options;
    let res:number=0;
    let even_odd:string="";
    if (max<min) throw new Error("max is less than min");
    for (let i=0;i<options.length;i++){
        if (options[i]=="odd" || options[i]=="Odd") even_odd="o";
        else if (options[i]=="even"||options[i]=="Even") even_odd="e";
    }
    if (typename=="int"){
        if (even_odd==""){
            res=Math.floor(Math.random()*(max-min+1)+min);
        }else if (even_odd=="o"){
            let range:number;
            if (Math.abs(min)%2==0) range=Math.floor((max-min+1)/2);
            else range=Math.floor((max-min)/2)+1;
            res=(Math.floor(Math.random()*range)+Math.floor(min/2))*2+1;
        }else if (even_odd=="e"){
            let range:number;
            if (Math.abs(min)%2==0) range=Math.floor((max-min)/2)+1;
            else range=Math.floor((max-min+1)/2);
            res=(Math.floor(Math.random()*range)+Math.floor((min+1)/2))*2;
        }
    }else{
        if (even_odd!="") throw new Error("Even and odd cannot be defined in floating point numbers ")
        res=Math.random()*(max-min)+min;
    }
    return res.toString();
}

export function generateList(constraint: ListConstraint){

    return "4 3 1";

}