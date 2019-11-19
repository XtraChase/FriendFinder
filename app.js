//         ****** Main APP ******
// Capture the form inpute
$("#submit").on("click", function(event) {
  var friendsObject;

  event.preventDefault();

  //     ***** Modal popup after clicking submit *****
  // Get the modal
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Form validation
  function validateForm() {
    var isValid = true;
    $(".form-control").each(function() {
      if ($(this).val() === "") {
        isValid = false;
      }
    });

    $(".chosen-select").each(function() {
      if ($(this).val() === "") {
        isValid = false;
      }
    });
    return isValid;
  }

  // If all required fields are filled
  if (validateForm()) {
    // Create an object for the user"s data
    var userData = {
      name: $("#name").val(),
      photo: $("#photo").val(),
      scores: [
        $("#q1").val(),
        $("#q2").val(),
        $("#q3").val(),
        $("#q4").val(),
        $("#q5").val(),
        $("#q6").val(),
        $("#q7").val(),
        $("#q8").val(),
        $("#q9").val(),
        $("#q10").val()
      ],
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) // unique ID
    };

    function modalView(element, score) {
      const modalBody = document.getElementById("modalBody");
      let dataHtml = `<h2>Meet Your Match!</h2>
          <p>Name: ${element.name}</p>
          <p>Match Score: ${100 - score * 10 + "%"}</p></br>
          <img src="${element.photo}" alt="Match Photo" width="350"/>`;
      modalBody.innerHTML = dataHtml;
    }

    //Find friend with minimum score
    var friendScores = [],
      totalDiff = 0;
    var minDiff = Number.MAX_SAFE_INTEGER,
      indexOfMinDiff = -1;
    var i, j;
    $.getJSON("/api/friends", function(json) {
      friendsObject = json;
      $.each(friendsObject, function(i) {
        friendScores = friendsObject[i].scores;
        if (userData.id != friendsObject[i].id) {
          $.each(friendScores, function(j) {
            totalDiff += Math.abs(userData.scores[j] - friendScores[j]);
            if (totalDiff < minDiff) {
              minDiff = totalDiff;
              indexOfMinDiff = i;
            }
          });
          totalDiff = 0;
        }
      });
      if (indexOfMinDiff != -1)
        modalView(friendsObject[indexOfMinDiff], minDiff);
    });

    // AJAX post the data to the friends API.
    $.post("/api/friends", userData, function(data) {
      // Grab the result from the AJAX post so that the best match's name and photo are displayed.
      $("#match-name").text(data.name);
      $("#match-img").attr("src", data.photo);
    });
  } else alert("Please fill out all fields before submitting!");
});
