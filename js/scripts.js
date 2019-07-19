//com window.localStorage.getItem persito os dados
let notes = window.localStorage.getItem('notes') || '{"data":[]}'; //declaracao de um array 
notes = JSON.parse(notes);


let updateList = function (){
    console.log('[Application] start watch');

    //Criado um observador
    // Toda a alteracao dentro do Array, sera refletido na 
    // lista id="notes"
    Array.observe(notes.data, function (changes){
        let index = null;
        let value = "";
        let status = null;
        ///console.log(changes)

        //Ou adicionou ou removeu
        if(changes[0].type === 'splice'){
            index = changes[0].index;
            value = changes[0].object[index];
            status = (changes[0].addedCount>0)?'created':'removed';
        }

        //Update
        if(changes[0].type === 'update'){
            index = changes[0].name;
            value = changes[0].object[index];
            status = 'update';
        }

        if(!value && ((status === 'created') || (status === 'updated'))){
            //Se o valor for vazio e o status for criado ou update quer dizer que inputaram um valor vazio, assim nao eh para fazer nada
            return;
        }

        let notesTag = document.getElementById('notes');

        if (status === 'update'){
            console.log('Implementar')
        }
        if (status === 'removed'){
            let listOfNotes = document.querySelectorAll('#notes li');
            notesTag.removeChild(listOfNotes[index]);

        }
        if (status === 'created'){
            let newLi = document.createElement('li');
            newLi.innerHTML = value;
            notesTag.appendChild(newLi);
        }
        window.localStorage.setItem('notes',JSON.stringify(notes));
    });
    
}

let createNote = function (){
    let input = document.querySelector('#form-add-note input[type="text"]');
    let value = input.value;
    notes.data.push(value);
    input.value="";
}

updateList();

document.addEventListener('DOMContentLoaded',function(event){  // Vou ficar escutando algum evento
    let listOfNotes = document.getElementById('notes');
    let listHtml = '';

    for (let i=0; i<notes.data.length; i++){
        listHtml += '<li>' + notes.data[i] + '</li>';
    }

    listOfNotes.innerHTML = listHtml;

    let formAddNotes = document.getElementById('form-add-note') //pego o elemento form = form-add-note
    formAddNotes.addEventListener('submit', function (e){
        e.preventDefault(); // muda o comportamento defaul de uma tag, no caso aqui o comportamento do submit, faremos a redefinicao desse comportamento apos o comando preventDefault
        createNote();
    }); //Fico escutando se algo ocorre com o elemeto submit

});

document.addEventListener('click',function(e){
    //console.log(e.target) => retorna o elemente que foi clicado
    let notesTag = document.getElementById('notes');

    //Se o pai do elemento clicado eh igual ao noteTag, faco alguma coisa
    if (e.target.parentElement === notesTag){
        if (confirm('Remover esta nota?')) {
            // pego todos os <li> que estao dentro da lista id="notes" 
            let listOfNotes = document.querySelectorAll('#notes li');
            //percorro toda a lista listOfNotes, onde item eh o elemento e o index seria a posicao onde este elemento se econtra dentro da lista que eh a mesma ordem do array note.data
            listOfNotes.forEach(function (item,index){
                if(e.target === item){
                    //splice elimina da posicao indicada no primeiro paramentro, quanto elementos a partir dele, indicada no segundo elemento
                    notes.data.splice(index,1);
                }
            });
        }
    }

});

if ('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('./service-worker.js')
    //promise : retorna a promessa de retorno de um dado ou erro de algo que nao deu certo
    //Retornou com sucesso
    .then(function(reg){
        console.log('Service worker Registered');
    })
    //Retornou com erro
    .catch(function(err){
        console.log('erro',err);
    });
}