const notesContainer = document.querySelector("#notes-container")
const notesInput = document.querySelector("#note-content")
const addNotesBtn = document.querySelector(".add-note")
const searchInput = document.querySelector("#search-input")
const exportsBtn = document.querySelector("#export-notes")

//f

function showNotes(){
    cleanNotes()
    getNotes().forEach((note)=>{
        const noteElement = createNote(note.id, note.content, note.fixed)
        notesContainer.appendChild(noteElement)
    })
}

function cleanNotes(){notesContainer.replaceChildren([])}

const addNote = () => {

    const notes = getNotes()

    const noteObject = {
        id: Math.floor(Math.random() * 10000),
        content: notesInput.value,
        fixed: false
    }

    notes.push(noteObject)

    const noteElement = createNote(noteObject.id, noteObject.content, false)
    notesContainer.appendChild(noteElement)

    notesInput.value = ""

    saveNotes(notes)

}

const createNote = (id, content, fixed) => {
    const element = document.createElement("div")
    element.classList.add("note")

    const textarea = document.createElement("textarea")
    textarea.value = content
    textarea.placeholder = "adicione algum texto..."
    element.appendChild(textarea)

    const pinIcon = document.createElement("i")
    pinIcon.classList.add(...['bi', 'bi-pin'])
    element.appendChild(pinIcon)

    const deleteIcon = document.createElement("i")
    deleteIcon.classList.add(...['bi', 'bi-x-lg'])
    element.appendChild(deleteIcon)

    const duplicateIcon = document.createElement("i")
    duplicateIcon.classList.add(...['bi', 'bi-file-earmark-plus'])
    element.appendChild(duplicateIcon)

    if(fixed) element.classList.add("fixed")

    element.querySelector(".bi-pin").addEventListener("click", (e)=>{
        targetAddFixed(id)
    })

    element.querySelector(".bi-x-lg").addEventListener("click", ()=>{
        deleteNote(id, element)
    })

    element.querySelector('.bi-file-earmark-plus').addEventListener("click", ()=>{
        copyNote(id)
    })

    element.querySelector("textarea").addEventListener("keyup", (e)=>{
        const noteContent = e.target.value
        updateNote(id, noteContent)         
    })

    return element
}

const updateNote = (id, newContent)=>{
    const notes = getNotes()
    const targetNote = notes.filter((note)=>note.id === id)[0]
    targetNote.content = newContent

    saveNotes(notes)
}

const copyNote = (id)=>{
    const notes = getNotes()

    const note = notes.filter((note)=> note.id === id)[0]  
    const noteObject = {
        id: Math.floor(Math.random() * 10000),
        content: note.content,
        fixed: false
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)
    notesContainer.appendChild(noteElement)
    
    notes.push(noteObject)
    saveNotes(notes)
}

const deleteNote = (id, element)=>{
    const notes = getNotes().filter((note)=> note.id !== id)
    saveNotes(notes)

    notesContainer.removeChild(element)
}

const targetAddFixed = (id)=>{
    const notes = getNotes()
    const targetNote = notes.filter((note)=>note.id === id)[0]

    targetNote.fixed = !targetNote.fixed
    saveNotes(notes)
    showNotes()
}

const searchNotes = (search)=>{
    const searchResults = getNotes().filter((note)=> {return note.content.includes(search)})
    if(search != ""){
        cleanNotes()
    searchResults.forEach((note)=>{

        const noteElement = createNote(note.id, note.content)
        notesContainer.appendChild(noteElement)
        })
    return;
}
cleanNotes()
showNotes()
}

const exportsData = ()=>{
    //separa com , e quebra com /n 
    const notes = getNotes()
    const csvString = [
        ["ID", "Content", "Fixed?"],
        ...notes.map((note) => [note.id, note.content, note.fixed])
    ].map((e) => e.join(",")).join("\n")

    const element = document.createElement("a")
    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString)
    element.target = "_blank"
    element.download = "notes.csv"
    element.click()
}

//e

addNotesBtn.addEventListener("click", () => {
    if (!notesInput.value) return;
    addNote()
})

searchInput.addEventListener("keyup", (e)=>{
    const search = e.target.value

    searchNotes(search)
})

notesInput.addEventListener("keyup", (e)=>{
    if(e.key === "Enter"){
        if (!notesInput.value) return;
        addNote() 
    }
})

exportsBtn.addEventListener("click", (e)=>{
    exportsData()
})

//lc

function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")
    const ordenedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1)

    return ordenedNotes
}

function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes))
}

showNotes()