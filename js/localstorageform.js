 /*controlling back button for FAQ page */

 if (window.history && window.history.pushState) {

     window.history.pushState('forward', null, 'index.php?r=supplier/#basic');
     $(window).on('popstate', function(e) {
         e.preventDefault();
         console.log("back button pressed ");
         if (localStorage) {
             if (localStorage.getItem(formToControl)) {

                 var boottext = "Please save your changes before you leave.";
                 bootbox.dialog({
                     message: boottext,
                     title: "There are some unsaved changes!",
                     buttons: {

                         danger: {
                             label: "Discard Changes",
                             className: "btn-danger ",
                             callback: function() {
                                 if (localStorage.getItem(formToControl))
                                     localStorage.removeItem(formToControl);

                                 var id = $("#components li:first a").attr("id");
                                 console.log("finsishes all tasks" + id);
                                 $("#" + id).trigger("click");
                                 // callback
                             }
                         },
                         success: {
                             label: "Save Changes",
                             className: "btn-success",
                             callback: function() {
                                 $("#" + formToControl).submit();
                             }
                         }

                     }
                 });
                 //window.history.pushState('forward', null, 'index.php?r=supplier/#faq');
             } else {
                 console.log("LocalStorage is not supported");
             }
         }

     });

 }
 // Check for LocalStorage support.
 if (localStorage) {
     if (localStorage.getItem(formToControl))
         renderform(localStorage.getItem(formToControl));

     console.log("LocalStorage is supported");
     $(" textarea,input[type=text]", "#" + formToControl).bind("change paste keyup", function() {
         localStorage.setItem(formToControl, JSON.stringify($("#" + formToControl).serializeArray()));
     });
 } else {
     alert("Please save your changes befor leaving this page!");
     console.log("LocalStorage is not supported");
 }
