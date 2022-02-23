const fs = require('fs');
const mongoose = require('mongoose');
const moment = require('moment');

console.log('hola');



/**
 * 
 * INICIO CREAR BD
 * 
 */

let url = 'mongodb://localhost:27017/mytasks';
let fichero = fs.readFileSync('./tasks.json');
let tareas = JSON.parse(fichero);
mongoose.Promise = global.Promise;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//esquema
let tareasSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    date: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    state: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    days: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

//modelo
let Tarea = mongoose.model('tareas', tareasSchema);




tareas.forEach(task => {            //Agrega cada task del json a la bd
    let tarea = new Tarea();
    tarea.name = task.name;
    tarea.date = task.date;
    tarea.state = task.state;
    tarea.days = task.days;

    tarea.save().then(resultado => {
        console.log("Contacto añadido:", resultado);
    }).catch(error => {
        console.log("ERROR añadiendo task");
    });

});
/**
 * 
 * FIN CREAR BD
 * 
 */


let estado = "primary";
let diasRestante = "";

//Poner fecha picker como hoy
document.getElementById('date').valueAsDate = new Date();


//Funcion mostrar todos
let buscarTodos = () => {
    Tarea.find().then(resultado => {
        representaTareas(resultado);
        let cadena = "";
        let cadenaCard = "";

        let today = false;

        let num = 1;
        resultado.forEach(task => {
            num++;
            console.log("ddd" + task.days)
            let nom = task.days;
            let esHody = esHoy(moment(task.days, "YYYYMMDD").fromNow());

            //255 x 65
            let imgRandom = `https://source.unsplash.com/featured?${task.name}/`;

            cadena += `
            
            <li class="list-group-item">
            <button id="btn-eliminar-task" value="${task.name}" type="button" class="btn btn-outline-danger" onClick="elim('${task.name}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg></button>
                <strong>${task.name} </strong>    
                <span class="badge badge-pill badge-${task.state}">${task.state}</span>
                <span class="badge badge-secondary">${moment(task.days, "YYYYMMDD").fromNow()}</span>

                ${esHody}
            
            </li>`;

            cadenaCard +=
                `<div class="card" style="width: 18rem; padding: 5px">
                <div style="overflow:hidden; width: auto; height: 80px; background-color: #138496">
                <img id="card-image" src="${imgRandom}" class="card-img-top"  alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title" style="font-family: 'Roboto Condensed', sans-serif;">${task.name}  ${esHody}</h5>
                    <span class="badge badge-pill badge-${task.state}">${task.state}</span>
                    <p class="card-text"><span class="badge badge-pill badge-dark">${moment(task.days, "YYYYMMDD").fromNow()}</span></p>
                    <button id="btn-eliminar-task" type="button" class="btn btn-outline-success" onClick="elim('${task.name}')">Success</button>
                </div>
                <div class="card-footer">
                        <small class="text-muted">Created ${task.date}</small>
                    </div>
                </div>
                <div>-</div>
                
                `
            //"https://source.unsplash.com/random/'+width+'x'+height+'">'
            // https://source.unsplash.com/featured?${task.name}

        });
        document.getElementById("wrapper").innerHTML = cadena;
        document.getElementById("wrapper-cards").innerHTML = cadenaCard;

    }).catch(error => {
        console.log("ERROR en find");
    });
}

//cargar los tareas pasados como parámetro
const representaTareas = (tasks => {
    let cadenaDOM = "";
    let fechaActual = moment().format('MMMM Do YYYY, h:mm:ss a'); // February 15th 2022, 11:52:27 am
    let daysRest = moment(diasRestante, "YYYYMMDD").fromNow(); // hace 10 años
    console.log(fechaActual);
    console.log(daysRest);

    tasks.forEach((task) => {
        cadenaDOM +=
            `     <span class="badge badge-pill badge-${task.state}">${task.state}</span>
        <span class="badge badge-pill badge-dark">${task.days}</span>
        <span class="badge badge-secondary">${task.date}</span>
    `;

    });
    document.getElementById("wrapper").innerHTML = cadenaDOM;
});

buscarTodos();

//Boton crear task
document.getElementById("addTask").addEventListener('click', () => {
    cleanNotf();

    console.log("days: " + diasRestante);

    let input = document.getElementById("newTask")
    let txtNuevaTask = document.getElementById("newTask").value;
    console.log("TASK: " + txtNuevaTask);

    if (txtNuevaTask === "") {
        cadena = ` <div class="alert alert-danger" role="alert">
        Error! Tarea vacia.
      </div>
        `;

        document.getElementById("notf-panel").innerHTML = cadena;
    } else {
        input.value = "";   //Limpiar textfield
        //Insertamos task
        let tarea = new Tarea({
            name: txtNuevaTask,
            date: moment().format('MMMM Do YYYY, h:mm:ss a'), // February 15th 2022, 12:01:41 pm
            state: estado,
            days: diasRestante

        });

        tarea.save().then(resultado => {
            //task añadido
            cadena = ` <div class="alert alert-success" role="alert">
           Tarea añadida correctamente!
          </div>`;

            document.getElementById("notf-panel").innerHTML = cadena;

        }).catch(error => {
            //error al añadir task
            cadena = ` <div class="alert alert-danger" role="alert">
            Error! La tarea no se puede añadir.
          </div>`;

            document.getElementById("notf-panel").innerHTML = cadena;

        });
    }

    setTimeout(() => {
        buscarTodos();
    }, 1000);

});


//Boton eliminar task por nombre
document.getElementById("deleteTask").addEventListener('click', () => {
    cleanNotf();
    let input = document.getElementById("newTask")
    let txtBorrar = document.getElementById("newTask").value;

    if (txtBorrar === "") {
        cadena = ` <div class="alert alert-danger" role="alert">
        Error! Tarea vacia.
      </div>`;

        document.getElementById("notf-panel").innerHTML = cadena;
    } else {
        input.value = "";   //Limpiar textfield

        Tarea.remove({ name: txtBorrar }).then(result => {

        }).catch(error => {
            cadena = ` <div class="alert alert-danger alert">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Error!</strong> No se puede eliminar la tarea!
            </div>`;

            document.getElementById("notf-panel").innerHTML = cadena;
        });
        buscarTodos();
    }
});


//Update panel
document.getElementById("updateTask").addEventListener('click', () => {
    let visibilidad = document.getElementById('updt-params').style.display;
    console.log(visibilidad);
    if (visibilidad == "none") {
        //poner visible
        document.getElementById('updt-params').style.display = 'inline';

    } else {
        //poner invisible
        document.getElementById('updt-params').style.display = 'none';
    }
});


//Cambiar vista botones
document.getElementById("btn-vistaList").addEventListener('click', () => {
    //poner visible lista, invisible cards
    document.getElementById('wrapper').style.display = 'block';
    document.getElementById('wrapper-cards').style.display = 'none';
});

document.getElementById("btn-vistaCard").addEventListener('click', () => {
    //poner visible lista, invisible cards
    document.getElementById('wrapper').style.display = 'none';
    document.getElementById('wrapper-cards').style.display = 'flex';
});



//Boton actualizar ahora
document.getElementById("btn-actualizar").addEventListener('click', () => {
    cleanNotf();

    let tf_nomActual = document.getElementById("tf_updt_nom_actual");
    let tf_nomNuevo = document.getElementById("tf_updt_nom_nuevo");

    let nomActual = document.getElementById("tf_updt_nom_actual").value;
    let nomNuevo = document.getElementById("tf_updt_nom_nuevo").value;

    console.log(nomActual + nomNuevo)

    if (nomActual == "" || nomNuevo == "") {
        console.log(' Escribe los nombres para la tarea')
        let cadena =
            `
       <div class="alert alert-info alert">
        
        <strong>Error!</strong> Escribe los nombres para la tarea </div>
       `
        document.getElementById("notf-panel").innerHTML = cadena;

    } else {

        const filter = { name: nomActual };
        const update = { name: nomNuevo, days: diasRestante, state: estado };
        Tarea.findOneAndUpdate(filter, update).then(resultado => {
            buscarTodos();
        }).catch(error => {
            console.log("error actualizar: " + nomNuevo);
        });
    }
});


//Buscar por nombre
document.getElementById("btn-search").addEventListener('click', () => {
    let nombre = document.getElementById("nom-task").value;
    console.log("Nombre a buscar: " + nombre)
    //let notificacion = document.querySelector("#notificacion");

    if (nombre == "") {
        console.log("No hay resultados de " + nombre)
        let cadena =
            `
       <div class="alert alert-info alert">
        <button type="button" class="close" data-dismiss="alert">&times;</button> 
        <strong>Error!</strong> Escribe un nombre primero </div>
       `


        document.getElementById("notf-panel").innerHTML = cadena;
    } else {
        Tarea.find({ name: { $regex: '.*' + nombre + '.*' } }).then(resultado => {
            let cadena = "";
            let cadenaCard = "";
            resultado.forEach(task => {
                let imgRandom = `https://source.unsplash.com/featured?${task.name}/`;
                console.log("Mostrando resultados de " + nombre)
                cadena +=
                    `
                    <li class="list-group-item">
                        <button id="btn-eliminar-task" value="${task.name}" type="button" class="btn btn-outline-danger" onClick="elim(ADsa)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                            <strong>${task.name} </strong>    
                            <span class="badge badge-pill badge-${task.state}">${task.state}</span>                         
                            <span class="badge badge-secondary">${task.date}</span>  
                    </li>
                `;

                cadenaCard +=
                    `
                    <div class="card" style="width: 18rem; padding: 5px">
                    <div style="overflow:hidden; width: auto; height: 80px; background-color: #138496">
                            <img id="card-image" src="${imgRandom}" class="card-img-top"  alt="...">
                        </div>
                    <div class="card-body">
                        <h5 class="card-title" style="font-family: 'Roboto Condensed', sans-serif;">${task.name}  ${esHody}</h5>
                        <span class="badge badge-pill badge-${task.state}">${task.state}</span>
                        <p class="card-text">
                            <span class="badge badge-pill badge-dark">${moment(task.days, "YYYYMMDD").fromNow()}</span>
                        </p>
                        <button id="btn-eliminar-task" type="button" class="btn btn-outline-success" onClick="elim('${task.name}')">Success</button>
                    </div>
                        <div class="card-footer">
                            <small class="text-muted">Created ${task.date}</small>
                        </div>
                    </div>
                    <div>-</div>
                `

            });
            if (cadena == "") {
                //notificacion.innerHTML = "No se ha encontrado ningun libro";
                //notificacion.opened = true;
            }
            document.getElementById("wrapper").innerHTML = cadena;
            document.getElementById("wrapper-cards").innerHTML = cadenaCard;

        }).catch(error => {
            console.log("ERROR en find");
        });
    }
})

//Click en picker fecha, guarda fecha
document.getElementById("date").addEventListener('click', () => {
    let fechaInput = document.getElementById("date").value;
    var arrayDeCadenas = fechaInput.split("-");
    diasRestante = arrayDeCadenas[0] + arrayDeCadenas[1] + arrayDeCadenas[2];
    console.log("Fecha partida: " + diasRestante)
})

//Mostrar todos
document.getElementById("btn-show-all").addEventListener('click', () => {
    cleanNotf();
    buscarTodos();
})

//Boton eliminar todos
document.getElementById("btn-delete-all").addEventListener('click', () => {
    cleanNotf();
    Tarea.remove().then(result => {

    }).catch(error => {
        cadena = ` 
        <div class="alert alert-danger alert">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Error!</strong> No se puede eliminar la tarea!
        </div>
        `;

        document.getElementById("notf-panel").innerHTML = cadena;
    });
    buscarTodos();

});


function elim(name) {
    let nombre = name;

    console.log("Eliminar: " + nombre)
    Tarea.remove({ name: nombre }).then(result => {

    }).catch(error => {
        cadena = ` <div class="alert alert-danger alert">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Error!</strong> No se puede eliminar la tarea!
        </div>`;

        document.getElementById("notf-panel").innerHTML = cadena;
    });
    buscarTodos();
}

//Estado
document.getElementById("btn-state-primary").addEventListener('click', () => {
    estado = "primary";
    console.log("Estado primary")
})
//Estado
document.getElementById("btn-state-secondary").addEventListener('click', () => {
    estado = "secondary";
    console.log("Estado secondary")
})
//Estado
document.getElementById("btn-state-success").addEventListener('click', () => {
    estado = "success";
    console.log("Estado success")
})
//Estado
document.getElementById("btn-state-info").addEventListener('click', () => {
    estado = "info";
    console.log("Estado info")
})
//Estado
document.getElementById("btn-state-warning").addEventListener('click', () => {
    estado = "warning";
    console.log("Estado warning")
})
//Estado
document.getElementById("btn-state-danger").addEventListener('click', () => {
    estado = "danger";
    console.log("Estado danger")
})

//Estado
document.getElementById("btn-state-light").addEventListener('click', () => {
    estado = "light";
    console.log("Estado light")
})

//Verifica si el dia de la task es igual o en menos de un dia
function esHoy(days) {
    console.log("CCCC" + days)
    if (days === "in a day" || days.includes("hours")) {
        return `        
            <div class="spinner-grow text-danger" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          `
    }
    return ` `
}

//Categorias events
document.getElementById("cat-primary").addEventListener('click', () => {
    let element = document.getElementById("cat-primary")
    myFunc(element);
})

document.getElementById("cat-secondary").addEventListener('click', () => {
    let element = document.getElementById("cat-secondary")
    myFunc(element);
})
document.getElementById("cat-success").addEventListener('click', () => {
    let element = document.getElementById("cat-success")
    myFunc(element);
})

document.getElementById("cat-danger").addEventListener('click', () => {
    let element = document.getElementById("cat-danger")
    myFunc(element);
})

document.getElementById("cat-warning").addEventListener('click', () => {
    let element = document.getElementById("cat-warning")
    myFunc(element);
})

document.getElementById("cat-info").addEventListener('click', () => {
    let element = document.getElementById("cat-info")
    myFunc(element);
})
document.getElementById("cat-light").addEventListener('click', () => {
    let element = document.getElementById("cat-light")
    myFunc(element);
})

function myFunc(element) {

    let valorCatClick = element.innerText;

    console.log("valor" + valorCatClick);




    if (valorCatClick == "") {
        console.log("No hay resultados de " + valorCatClick)
        let cadena = `<h3>No hay resultados disponibles :)</h3>`;
        document.getElementById("wrapper").innerHTML = cadena;
        //notificacion.innerHTML = "Debe escribir algo";
        //notificacion.opened = true;A
    } else {

        document.getElementById("wrapper").innerHTML = "";
        Tarea.find({ state: { $regex: '.*' + valorCatClick + '.*' } }).then(resultado => {
            let cadena = "";
            let cadenaCard = "";
            resultado.forEach(task => {
                let esHody = esHoy(moment(task.days, "YYYYMMDD").fromNow());
                let imgRandom = `https://source.unsplash.com/featured?${task.state}/`;
                console.log("Mostrando resultados de " + valorCatClick)

                cadena += `
                <li class="list-group-item">
                <button id="btn-eliminar-task" value="${task.name}" type="button" class="btn btn-outline-danger" onClick="elim('${task.name}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg></button>
                    <strong>${task.name} </strong>    
                    <span class="badge badge-pill badge-${task.state}">${task.state}</span>
                    <span class="badge badge-secondary">${moment(task.days, "YYYYMMDD").fromNow()}</span>
    
                    ${esHody}
                
                </li>
                            
                `;

                cadenaCard +=
                   `
                    <div class="card" style="width: 18rem; padding: 5px;">
                    <div style="overflow:hidden; width: auto; height: 80px; background-color: #138496">
                    <img id="card-image" src="${imgRandom}" class="card-img-top"  alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title" style="font-family: 'Roboto Condensed', sans-serif;">${task.name}  ${esHody}</h5>
                        <span class="badge badge-pill badge-${task.state}">${task.state}</span>
                        <p class="card-text"><span class="badge badge-pill badge-dark">${moment(task.days, "YYYYMMDD").fromNow()}</span></p>
                        <button id="btn-eliminar-task" type="button" class="btn btn-outline-success" onClick="elim('${task.name}')">Success</button>
                    </div>
                    <div class="card-footer">
                            <small class="text-muted">Created ${task.date}</small>
                        </div>
                    </div>
                    <div>-</div>
                    
                `

            });
            if (valorCatClick == "") {
                //notificacion.innerHTML = "No se ha encontrado ningun libro";
                //notificacion.opened = true;
            }
            document.getElementById("wrapper").innerHTML = cadena;
            document.getElementById("wrapper-cards").innerHTML = cadenaCard;

        }).catch(error => {
            console.log("ERROR en find");
        });
    }
}

function cleanNotf() {
    document.getElementById("notf-panel").innerHTML = ' ';
}

