$.get JSON('/stories', function(data){
  for (var i = 0; i < data.length; i++){
    $('#stories').append('<p data-id=" ' + data[i]._id +' ">' + data[i].title + '<br />' + data[i].link + '</p>');
  }
});

$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/stories" + thisId,
  })
  .done(function(data){
    console.log(data);
    $('#notes').append('<h4>' + data.title + '</h4>');
    $('#notes').append('<input id="titleinput" name="title">');
    $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
    $('#notes').append('<button data-id=" ' + data._id + '" id="savenote">Save</button>');

    if(data.note){
      $('#titleinput').val(data.note.title);
      $('#bodyinput').val(data.note.body);
    }
  });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/stories/" + thidId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
  .done(function(data){
    console.log(data);
    $('#notes').empty();
  });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});
