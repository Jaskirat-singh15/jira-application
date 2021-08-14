let allFilters = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid");
let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let modalVisible = false;
let uid = new ShortUniqueId();
let colors = {
     pink  : "#d595aa" ,
     blue  : "#5ecdde",
     green : "#02462d",
     yellow:"yellow"
};

let colorClasses = ["pink","blue","green","yellow"];

let deleteState = false;
let deleteBtn = document.querySelector(".delete");
let deleteMode = document.querySelector(".deleteMode");
let stateIndicator = document.querySelector(".stateIndicator");
// initialization step
if(!localStorage.getItem("tasks")){
    localStorage.setItem("tasks",JSON.stringify([]));
}

deleteBtn.addEventListener("click",function(e){
    if(deleteState){
        deleteState = false;
        deleteMode.style.background = "red";
        stateIndicator.style.color = "red";
        stateIndicator.innerText = `OFF`;
        e.currentTarget.classList.remove("delete-state");
    }
    else {
        deleteState = true ;
        deleteMode.style.background = "green";
        stateIndicator.style.color= "green";
        stateIndicator.innerText = `ON`;
        e.currentTarget.classList.add("delete-state");
    }
});

let grad = document.querySelectorAll(".grad");
for(let i =0 ; i<grad.length ; i++){
    grad[i].addEventListener("click",function(e){
       for(let j =1 ; j<= 4 ; j++){
           grid.classList.remove(`c${j}`)  

       }
        grid.classList.add(`c${i+1}`)
    });
}
addBtn.addEventListener("click",function(e){
    if(modalVisible)  return;

        if(deleteBtn.classList.contains("delete-state")){
            deleteState = false;
            deleteBtn.classList.remove("delete-state");
            
            deleteMode.style.background = "red";
            stateIndicator.style.color = "red";
            stateIndicator.innerText = `OFF`;
        }
         
        let modal =   document.createElement("div");
        modal.setAttribute("click-first",true);
        modal.classList.add("modal-container");
        modal.innerHTML= `<div class="writing-area" contenteditable>Enter Your Task Here</div>
        <div class="filter-area">
            <div class="modal-filter pink"></div>
            <div class="modal-filter blue"></div>
            <div class="modal-filter green"></div>
            <div class="modal-filter yellow active-modal-filter"></div>
        </div>`;
          body.append(modal);
          modalVisible = true;
    
   
     let wa = modal.querySelector(".writing-area");   // why cant do document.querySelector?
     wa.addEventListener("click",function(){
         if(modal.getAttribute("click-first") == "true"){
             wa.innerText = "";
             modal.setAttribute("click-first",false);   
         }
     
    });

    let modalFilter = modal.querySelectorAll(".modal-filter");
    for(let i =0 ; i< modalFilter.length ; i++){
        modalFilter[i].addEventListener("click",function (e){
            for(let j=0 ; j<modalFilter.length ; j++){
                modalFilter[j].classList.remove("active-modal-filter");
            }
            e.currentTarget.classList.add("active-modal-filter");
        });
    }
   

    wa.addEventListener("keypress",function (e){
        if(e.key == "Enter"){
        let task = e.currentTarget.innerText;
        let selectedModalFilter = modal.querySelector(".active-modal-filter");
        let color = selectedModalFilter.classList[1];
        let id = uid();
        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
        ticket.innerHTML = ` <div class="ticket-color ${color}"></div>
        
        <div class="ticket-id" >#${id} </div>
        <div class="ticket-box " contenteditable>${task}</div>
        </div>`;
    
    
        let ticketWritingArea = ticket.querySelector(".ticket-box");
    
        ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);
      
    
        saveTicketInLocalStorage(id ,color, task);
         
       ticket.addEventListener("click",function(e){
        if(deleteState){
        let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
        let taskArr = JSON.parse(localStorage.getItem("tasks"));
        let reqIdx = -1;
     for(let i=0 ; i<taskArr.length ; i++){
         if(taskArr[i].id == id){
           reqIdx = i;
           break;
         }
     }

     taskArr = taskArr.filter(function(el){
         return el.id!=id;
     });
    
        localStorage.setItem("tasks",JSON.stringify(taskArr));
        
      
               e.currentTarget.remove();
           }
       });
    
        let ticketColorDiv = ticket.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click",ticketColorHandler);
    
    
    
        modal.remove();
        modalVisible = false;
        grid.appendChild(ticket);
       }
    });

});


for(let i=0 ; i<allFilters.length ; i++){
    allFilters[i].addEventListener("click", function(e){
        if (e.currentTarget.parentElement.classList.contains("selected-filter")) {
            e.currentTarget.parentElement.classList.remove("selected-filter");
            loadTask();
          } else {
            let color = e.currentTarget.classList[0].split("-")[0];
            e.currentTarget.parentElement.classList.add("selected-filter");
            console.log(color);
            loadTask(color);
          }
    });
}


function saveTicketInLocalStorage(id , color , task){
    let requiredObject = { id , color , task};
   let taskArr =  JSON.parse(localStorage.getItem("tasks"));
   taskArr.push(requiredObject);
   localStorage.setItem("tasks",JSON.stringify(taskArr));

}



function ticketColorHandler(e){
          
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
     let taskArr = JSON.parse(localStorage.getItem("tasks"));
    let reqIdx = -1;
     for(let i=0 ; i<taskArr.length ; i++){
         if(taskArr[i].id == id){
           reqIdx = i;
           break;
         }
     }

   let currColor =  e.currentTarget.classList[1];
   let index = colorClasses.indexOf(currColor);
   index++;
   index = index%4;
   e.currentTarget.classList.remove(currColor);
   e.currentTarget.classList.add(colorClasses[index]);
   
    taskArr[reqIdx].color = colorClasses[index];
   localStorage.setItem("tasks",JSON.stringify(taskArr));
 }

 function ticketWritingAreaHandler(e){
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
     let taskArr = JSON.parse(localStorage.getItem("tasks"));
     let reqIdx = -1;
     for(let i =0 ; i<taskArr.length ; i++){
         if(taskArr[i].id == id){
             reqIdx = i;
             break;
         }
     }
     taskArr[reqIdx].task = e.currentTarget.innerText;
     localStorage.setItem("tasks",JSON.stringify(taskArr));

}

function loadTask(passedColor){

     //agr koi ticket ui pr pehle se hai use remove kr rhe hai
  let allTickets = document.querySelectorAll(".ticket");
  for (let t = 0; t < allTickets.length; t++) allTickets[t].remove();

let task = JSON.parse(localStorage.getItem("tasks"));
for(let i=0 ; i< task.length ; i++){
   let id = task[i].id;
   let color = task[i].color;
   let taskValue = task[i].task;

   
   if (passedColor) {
    if (passedColor != color) continue;
  }

   let ticket = document.createElement("div");
   ticket.classList.add("ticket");
   ticket.innerHTML = ` <div class="ticket-color ${color}"></div>
   <div class="ticket-id" >#${id} </div>
   <div class="ticket-box " contenteditable>${taskValue}</div>
   </div>`;


   let ticketWritingArea = ticket.querySelector(".ticket-box");
    
   ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);
 

   let ticketColorDiv = ticket.querySelector(".ticket-color");
   ticketColorDiv.addEventListener("click",ticketColorHandler);

    
  ticket.addEventListener("click",function(e){
   if(deleteState){
   let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
   let taskArr = JSON.parse(localStorage.getItem("tasks"));
   let reqIdx = -1;
for(let i=0 ; i<taskArr.length ; i++){
    if(taskArr[i].id == id){
      reqIdx = i;
      break;
    }
}

taskArr = taskArr.filter(function(el){
    return el.id!=id;
});

   localStorage.setItem("tasks",JSON.stringify(taskArr));
   
 
          e.currentTarget.remove();
      }
  });

   grid.appendChild(ticket);

}
}

loadTask();