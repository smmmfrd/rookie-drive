export default function DocDisplay({docElement, editing, editElements}){
    return(
        <div className="doc-editor">
            <div className="doc-editor--display">
                {docElement}
            </div>
            {editing && 
                <div className="doc-editor--input-container">
                    {editElements}
                </div>
            }
        </div>
    )
}