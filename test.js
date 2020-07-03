const root="http://jsonplaceholder.typicode.com";
id= 1;
let uri=root+'/users/'+id;

fetch(uri).then((response)=>{
    return response.json();
}).then(data=>{
    console.log(data);
    let jsonData= JSON.stringify(data);
    console.log(jsonData);
})
.catch((err)=>{

    console.log('Error: ',err.message)
}); 