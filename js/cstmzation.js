
var counter = 1

function multiplyNode(node, count, deep) {
    for (var i = 0, copy; i < count - 1; i++) {
        copy = node.cloneNode(deep);
        copy.id = "test".concat(counter)
        counter = counter + 1
        node.parentNode.insertBefore(copy, node);
    }
}

function remove(el) {
  var element = el;
  element.remove();}


function opensetting(target) {
  var holder = target.parentElement
  mappings = grabscrequestsingle(target.parentElement.id)
  console.log(target.parentElement.id)

  var target1 = holder.getElementById('t1')
  var target2 = holder.getElementById('t2')
  var target3 = holder.getElementById('t3')

  var target4 = holder.getElementById('sankey12text')
  var target5 = holder.getElementById('sankey23text')

  target1.innerHTML = mappings["target0"].concat(" Chart Selection");
  target2.innerHTML = mappings["target1"].concat(" Chart Selection");
  target3.innerHTML = mappings["target2"].concat(" Chart Selection");
  target4.innerHTML = mappings["target0"]+" to "+mappings["target1"]+" Chart";
  target5.innerHTML = mappings["target1"]+" to "+mappings["target2"]+" Chart";

  console.log(mappings)


}


function grabscrequestsingle(id){
    var target = document.getElementById(id);
    var values = target.getElementsByClassName('reportcustominput')
    var mapping = {}
    for (var i = 0; i < values.length; i++) {
      if(i < 3){
        mapping["target".concat(i)] = values[i].value
      }
      if(i >= 3){
        mapping["situation".concat(i-3)] = values[i].value
      }
    }
    return mapping
}
