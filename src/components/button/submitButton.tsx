import clsx from "clsx";

interface buttonType{
    isPending:boolean;
    text:string;
    type?:'button'|'submit'|'reset';
    className:string;
    children:React.ReactNode;
}

export default function SubmitButton({children,isPending,text='submit',type='button',className}:buttonType) {
    return(
        <>
        <button className={className}
       type={type} disabled={isPending} >{isPending?'Submitting':text}{children}</button>
        </>
    )
}