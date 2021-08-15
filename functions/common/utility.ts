var removeElement = function(arr,fieldName,value){

    var newArr =[];
    var n = arr.length;

    for(let i=0;i<n;i++){
        if(arr[i][fieldName] === value){
            continue;
        }else{
            newArr.push(arr[i]);
        }
    }

    console.log(newArr);

    return newArr;

};


exports.removeElement = removeElement;