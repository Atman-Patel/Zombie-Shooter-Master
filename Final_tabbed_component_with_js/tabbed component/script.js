let list = [1,2,3,4,5]
list.forEach((num)=>{
    let tab = document.querySelector(`#tab-${num}`)
    document.addEventListener('keyup',(e)=>{
        if(e.key == num){
            tab.checked = true
        }
    })
})