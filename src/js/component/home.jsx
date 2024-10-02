import React, { useState, useEffect } from "react";
const urlUser = 'https://playground.4geeks.com/todo/users/OZtro'
const urlTodos = 'https://playground.4geeks.com/todo/todos/OZtro'

const Home = () => {

	const [todo, setTodo] = useState([])
	const [newTodo, setNewTodo] = useState('')


	//Aqui reviso en mi API si el usuario existe sino crealo y si no esta que me responda not found

	async function getData() {
		let response = await fetch(urlUser)

		if (response.status === 404) {
			crearUser();
		}
		let data = await response.json();
		if (response.ok) {
			setTodo(data.todos)
		} else {
			console.log('Not found')
		}
	}


	// luego creo una funcion async para que se inicialice luego de mi getdata para crear mi usuario

	async function crearUser() {
		try {
			let responseCreate = await fetch(urlUser, {
				method: "POST",
			});

			if (responseCreate.ok) {
				getData()
				console.log("User created")
			} else {
				console.log("User not created")
			}
		} catch (error) {
			console.log(error)
		}
	}



	//Aqui genero mis ToDos y actualizo en mi API medienate getData

	const newInputList = async (event) => {

		if (newTodo == '') return
		if (event.key === 'Enter') {
			try {
				let response = await fetch(urlTodos, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						"label": newTodo,
						"is_done": false
					})

				});
				if (response.ok) {
					getData()
					setNewTodo('');
				} else{
					console.log('no se creo la tarea')
				}
			}
			catch (error) {
				console.log(error)
			}
		}
	}




	//Aqui borro mis todos y luego actualizo en mi API mediante getData
	const inputDelete = async (index) => {
		setTodo(todo.filter((todo, i) => i !== index))
		try {
			let response = await fetch('https://playground.4geeks.com/todo/todos/' + `${index}`, {
				method:  'DELETE',
			});
			if (response.ok) {
				getData()
			}
		} catch (error) {
			
		}
	}

//Me aseguro de que solo se renderice una sola vez mi Todo List

	useEffect(() => {
		getData()
	}, [])



	return (
		<main>
			<h1>todos</h1>


			<div className="postIt">
				<ul className="list-group">
					<li className="list-group-item"> <input
						className="form-control"
						type="text"
						value={newTodo}
						onChange={(e) => setNewTodo(e.target.value)}
						onKeyDown={newInputList}
						placeholder={todo.length === 0 ? "No hay tareas" : "añadir tareas"}

					/> </li>
					{
						(todo.map((todo) => (
							<li 
								className="list-group-item"
								key={todo.id}
							>
								{todo.label}
								<button
									onClick={() => inputDelete(todo.id)}
									className="delete-button"
								>
									<span className="delete-icon text-danger">X</span>
								</button>
							</li>
						)))}
				</ul>
				<p>{todo.length} tareas pendientes</p>

			</div>




		</main>
	);
};

export default Home;
