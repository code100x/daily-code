import styles from "../app/CodeBlock.module.css";

interface CodeContentInterface {
  theme : string | undefined, 
  code : string, 
  codeId : string
}


export default function CodeContent({code,codeId,theme} : CodeContentInterface){
    return(
        <pre className={`${styles.code_block} ${theme == 'dark' ? styles.code_block_dark : styles.code_block_light} rounded-lg px-4 sm:px-6 md:px-8 relative`}>
        <code>{code}</code>
        <div className={`${styles.copy_block} absolute top-0 right-0`}>
          <button
            className={`${styles.copy_button} ${theme == 'dark' ? styles.copy_button_dark : styles.copy_button_light}`}
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                // @ts-ignore
                document.getElementById(codeId).style.display = "block";
                setTimeout(() => {
                  // @ts-ignore
                  document.getElementById(codeId).style.display = "none";
                }, 1000);
              });
            }}
          >
            Copy
          </button>
          <div id={codeId} className={`${styles.copied_text} ${theme == 'dark' ? styles.copied_text_dark : styles.copied_text_light}`}>
            Copied!!
          </div>
        </div>
      </pre>
    )
}