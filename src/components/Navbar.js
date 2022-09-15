export default function Navbar({ newFile }) {
    return(
        <nav>
            <h1>Rookie Drive</h1>
            <div>
                <button onClick={newFile}>+ New File</button>
                <button>Sign In</button>
            </div>
        </nav>
    )
}