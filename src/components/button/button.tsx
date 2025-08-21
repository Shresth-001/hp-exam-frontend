import clsx from "clsx";

interface buttonType{
    isPending:boolean;
    text:string;
    type?:'button'|'submit'|'reset';
    className:string;
    children:React.ReactNode;
    pendingtext?:string;
    onClick?:()=>void
    hidden?:boolean;
    name?:string;
    disable?:boolean
}

export default function Button({disable=false,name,hidden,onClick,pendingtext,children,isPending,text='submit',type='button',className}:buttonType) {
    return(
        <>
        <button title={name} name={name}  className={className} hidden={hidden} onClick={onClick} 
       type={type} disabled={disable} >{isPending?pendingtext:text}{children}</button>
        </>
    )
}