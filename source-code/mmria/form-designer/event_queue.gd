extends Object
class_name event_queue

var stack : Array[move_event] = []


class target_object:
	var from_position = Vector2.ZERO
	var to_position = Vector2.ZERO
	var object_id : int
		
class move_event:
	var move_difference = Vector2.ZERO
	var target_object_list : Array[target_object] = []



func push(value: move_event):
	stack.push_back(value)
	print("event.push queue size %s" % self.size())
	

func pop()-> move_event:
	var result = stack.pop_back()
	
	print("event.pop queue size %s" % self.size())
	
	return result

func size()-> int:
	return stack.size()
