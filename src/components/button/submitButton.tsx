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
        <button className={clsx(
        'flex h-10 items-center rounded-lg bg-red-500/55 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500/40  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-red-600/55 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
       type={type} disabled={isPending} >{isPending?'Submitting':text}{children}</button>
        </>
    )
}