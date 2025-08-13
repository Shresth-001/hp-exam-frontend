interface FileUploadFIelds{
    className:string;
    accept:string;
    required?:boolean;
    name:string;
    id:string;
    type:string;
}
const FileUploadFIelds = ({type,id,name,required=true,className,accept}:FileUploadFIelds) => {
    
  return (
    <>
        <input
        className={`hidden ${className}`}
            id={id}
          type={type}
          name={name}
          accept={accept}
          required={required}
          style={{ display: "block", width: "100%" }}
        />
    </>
  )
}

export default FileUploadFIelds