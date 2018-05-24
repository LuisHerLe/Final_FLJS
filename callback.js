function saludar(name, callback){
  callback(name);
}

saludar('Luifo', function(name){
  console.log('Hola', name);
})
