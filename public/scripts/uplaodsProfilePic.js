window.onload = function () {
  let baseCropping = $("#cropped-image").croppie({
    viewport: {
      width: 200,
      height: 200,
    },
    boundary: {
      width: 300,
      height: 300,
    },
    showZoomer: true,
  });

  function readableFile(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      baseCropping
        .croppie("bind", {
          url: e.target.result,
        })
        .then(() => {
          $(".cr-slider").attr({
            min: 0.2,
            max: 1.5,
          });
        });
    };
    reader.readAsDataURL(file);
  }

  $("#profilePicFile").on("change", function (e) {
    if (this.files[0]) {
      readableFile(this.files[0]);
      $("#crop-modal").modal({
        backdrop: "static",
        Keyboard: false,
      });
    }
  });

  $("#cancel-cropping").on("click", function () {
    $("#crop-modal").modal("hide");
  });

  $("#upload-image").on("click", function () {
    baseCropping
      .croppie("result", "blob")
      .then((blob) => {
        let formData = new FormData();
        let file = document.getElementById("profilePicFile").files[0];
        let name = generateFileName(file.name);
        formData.append("profilePic", blob, name);

        let headers = new Headers();
        headers.append("Accept", "Application/JSON");

        let req = new Request("/uploads/profilePic", {
          method: "POST",
          headers,
          mode: "cors",
          body: formData,
        });
        return fetch(req);
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        document.getElementById("removeProfilePic").style.display = "block";
        document.getElementById("profilePic").src = data.profilePic;
        document.getElementById("profilePicForm").reset();

        $("#crop-modal").modal("hide");
      });
  });

  $("#removeProfilePic").on("click", function () {
    let req = new Request("/uploads/profilePic", {
      method: "DELETE",
      mode: "cors",
    });

    fetch(req)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        document.getElementById("removeProfilePic").style.display = "none";
        document.getElementById("profilePic").src = data.profilePic;
        document.getElementById("profilePicForm").reset();
      })
      .catch((e) => {
        console.log(e);
        alert("server error occurrd");
      });
  });
};

function generateFileName(name) {
  const types = /(.jpeg|.jpg|.png|.gif)/;
  return name.replace(types, ".png");
}
