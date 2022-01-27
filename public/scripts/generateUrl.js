async function deleteRow(a) {
  // var myName = document.getElementById('myT');
  // var age = document.getElementById('age');
  const id = a.id.split('/')[3];
  document.getElementById(`${a.id}`).remove();
  await axios
    .delete(`/byte/${id}`)
    .then((resp) => {
      console.log(`${id}`, resp);
    })
    .catch((err) => {
      console.log(err);
    });
}
