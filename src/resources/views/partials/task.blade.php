<?php 
	$last_record = $task->task_state_records->last();
?>

@if($last_record->state == "Completed")
	<div data-id="{{ $task->id}}" class="sprint-task task_completed">
		<a data-toggle="collapse" data-target="#task-{{$task->id}}" aria-expanded="false">
			<i class="fas fa-sort-down"></i></a>
			<a class="task_name" href="{{route('task_page',['project_id' => $project->id, 'task_id' => $task->id])}}">{{$task->name}}</a>

		<input data-url="{{ route('update_task', ['project_id' => $project->id, 'task_id' => $task->id])}}" type="checkbox" checked>
	</div>
@else
	<div data-id="{{ $task->id}}" class="sprint-task">
		<a data-toggle="collapse" data-target="#task-{{$task->id}}" aria-expanded="false">
			<i class="fas fa-sort-down"></i></a>
		<a class="task_name" href="{{route('task_page',['project_id' => $project->id, 'task_id' => $task->id])}}">{{$task->name}}</a>

		@if($last_record->state == "Assigned")
			<div class="assigned_users">
				@if($last_record->user->image != NULL)
					<img alt="Profile Image" src="{{ asset('storage/'. $last_record->user->image)}}" title="{{ $last_record->user->username}}">
				@else
					<img alt="Profile Default Image" src="{{ asset('storage/'. '1ciQdXDSTzGidrYCo7oOiWFXAfE4DAKgy3FmLllM.jpeg')}}" title="{{ $last_record->user->username}}">
				@endif
			</div>
		@endif

		<input data-url="{{ route('update_task', ['project_id' => $project->id, 'task_id' => $task->id])}}" type="checkbox">

	</div>
@endif

<div class="list-group panel-collapse collapse in" id="task-{{$task->id}}">
	@foreach($task->comments as $comment)
		@include('partials.comment', ['project' => $project,'comment' => $comment,'task' => $task,'role' => $role])
	@endforeach
	
	<div class="comment">
		<p class="label">New comment:</p>
		<div class="form_comment row">
			<form method="POST" id="submit" action="{{ route('create_comment_task',['project_id' => $project->id,'task_id' => $task->id]) }}">
				{{ csrf_field()}}
				<input type="text" class="form-control col-10" name="content" required>
				<button class="btn btn-primary col-2" type="submit">Send</button>
			</form>
		</div>
	</div>
</div>