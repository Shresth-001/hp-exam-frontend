import clsx from "clsx";
import ReactSpinner from "../loader/reactSpinner";

interface buttonType{
    isPending:boolean;
    text:string;
    type?:'button'|'submit'|'reset';
    className:string;
    children:React.ReactNode;
    handleSubmit?:()=>void
}

export default function SubmitButton({handleSubmit,children,isPending,text='submit',type='submit',className}:buttonType) {
    return(
        <>
        <button className={className} onClick={handleSubmit}
       type={type} disabled={isPending} >{isPending?'':text}{isPending?<ReactSpinner size={20} divClassName={"flex item-center justity-center "} spanClassName="text-black" showText={false} spinnerClassName={"animate-spin text-white"}/>:children}</button>
        </>
    )
}