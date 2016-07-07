
// ********************DELCARATIONS*******************************
var divString = "<div class=\"task\"><i class=\"fa fa-check checkmark\">" +
 "</i><p></p><i class=\"fa fa-trash-o delete-task\"></i>" +
 "<i class=\"fa fa-check-square-o mark-complete\"></i></div>";

var $viewFilters = $(".view-filter li button");
var $add = $(".add");
var $taskInput = $(".task-input");
// *******************END DECLARATIONS****************************


// ***********************LISTENERS*******************************
$viewFilters.on("click", function(evt){
  $viewFilters.removeClass("active");
  $(evt.target).addClass("active");
  updateList();
});

$add.on("click", function(){
  if ($taskInput.val().length > 1){ // accidentally hitting button does not add empty task
    addTask($taskInput.val());
    $taskInput.val("");
  }
});

// *******************END LISTENERS*******************************


// ********************** A J A X ********************************

// get objects from api and update the displayed list
function updateList(){
  listOfTasks = [];
  $.ajax({
    url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-18",
    type: "GET",
    contentType: "application/json",
    success: function(response){
      listOfTasks = response;
      $("main").empty();

      // filter complete or incomplete tasks based on selected tab
      var index = $viewFilters.index($(".active"));
      if (index === 1){
        listOfTasks = listOfTasks.filter(function(task){
          return task.complete;
        });
      } else if (index === 2){
        listOfTasks = listOfTasks.filter(function(task){
          return !task.complete;
        });
      }

      // create div for each task
      listOfTasks.forEach(function(task){
        var $newTask = $(divString);
        $newTask.children("p").text(task.title);
        if (task.complete){
          $newTask.children(".checkmark").css("visibility", "visible");
        } else {
          $newTask.children(".checkmark").css("visibility", "hidden");
        }

        // listener for marking task as complete
        $newTask.children(".mark-complete").on("click", function(){
          toggleComplete(task._id, task.complete);
        });

        // listener for deleting a task
        $newTask.children(".delete-task").on("click", function(){
          deleteTask(task._id);
        });
        $("main").append($newTask);

      }); // end listOfTasks forEach
    }
  }); // end updateList ajax
}

// creates new object
function addTask(description){
  $.ajax({
    url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-18",
    type: "POST",
    contentType: "application/json",
    success: function(response){
      // console.log(response);
      updateList();
    },
    data: JSON.stringify({
      title: description,
      complete: false
    })
  });
}

// deletes object, takes an id as parameter
function deleteTask(id){
  $.ajax({
    url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-18/" + id,
    type: "DELETE",
    success: function(response){
      // console.log(response);
      updateList();
    }
  });
}

// toggles 'complete' between true and false, takes id and current boolean state as parameter
function toggleComplete(id, bool){
  $.ajax({
    url: "http://tiny-za-server.herokuapp.com/collections/jlee-day-18/" + id,
    type: "PUT",
    contentType: "application/json",
    success: function(response){
      // console.log(response);
      updateList();
    },
    data: JSON.stringify({
      complete: !bool
    })
  });
}

// ***********************END AJAX****************************************


// **********************MAIN FUNCTION CALL******************************
updateList();




// ***********************************************************************
