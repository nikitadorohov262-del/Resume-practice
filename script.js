const token = localStorage.getItem("supabaseToken");
const auth = document.getElementById("authScreen");
const trecker = document.getElementById("trackerScreen");
if (token) {
    auth.style.display = "none";
    trecker.style.display = "flex";
    loadTasks();
}else{
    trecker.style.display = "none";
    auth.style.display = "flex";
}



const button = document.getElementById("add");
const input = document.getElementById("task");
const tasks = document.getElementById("container");
const URL = "https://lzebzysiovfimquwuxpx.supabase.co/rest/v1/tasks"
const pass = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZWJ6eXNpb3ZmaW1xdXd1eHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTUxMzg1OSwiZXhwIjoyMTA3MDg5ODU5fQ.P759J4bOn2PPE52Pd74kO0PfWUFTR1ZtymEvLmQR6SM"
const reg = document.getElementById("regBtn");
const password = document.getElementById("pass");
const log = document.getElementById("logBtn");
const email = document.getElementById("email");
const all = document.getElementById("filter-all");
const active = document.getElementById("filter-active");
const completed = document.getElementById("filter-completed");
const loader = document.getElementById("loader");
const exit = document.getElementById("logOut");

exit.addEventListener("click", function(){
    localStorage.removeItem("supabaseToken")
    auth.style.display = "flex";
    trecker.style.display = "none";
    tasks.innerHTML = "";
});


all.addEventListener("click", async function(){
    all.classList.add("active-filter")
    completed.classList.remove("active-filter")
    active.classList.remove("active-filter")
    const allTasks = document.querySelectorAll('.task-item');
    allTasks.forEach((task) => {
        task.style.display = 'flex';
    });
});

active.addEventListener("click", async function(){
    all.classList.remove("active-filter")
    completed.classList.remove("active-filter")
    active.classList.add("active-filter")
    const allTasks = document.querySelectorAll('.task-item');
    allTasks.forEach((task) => {
        if (task.style.textDecoration === 'line-through') {
            task.style.display = 'none';
        }else{
            task.style.display = 'flex';
        }
    });

});

completed.addEventListener("click", async function(){
    all.classList.remove("active-filter")
    completed.classList.add("active-filter")
    active.classList.remove("active-filter")
    const allTasks = document.querySelectorAll('.task-item');
    allTasks.forEach((task) => {
        if (task.style.textDecoration === 'line-through') {
            task.style.display = 'flex';
        }else{
            task.style.display = 'none';
        }
    });
});

reg.addEventListener("click", async function(){
    const mail = email.value
    const wordPass = password.value

    const response = await fetch("https://lzebzysiovfimquwuxpx.supabase.co/auth/v1/signup", {
        method: "POST",
        headers:{
			'apikey': pass,
			'Content-Type': "application/json"
		},
		body: JSON.stringify({email: mail, password: wordPass})
    });

    const data = await response.json();

    if(!response.ok){
        alert("Ошибка: " + data.msg)
    }else{
        alert("Регистрация прошла успешно!")
        auth.style.display = "none";
        trecker.style.display = "flex"
    }

    email.value = "";
    password.value = "";
});


log.addEventListener("click", async function(){
    const mail = email.value
    const wordPass = password.value

    const response = await fetch("https://lzebzysiovfimquwuxpx.supabase.co/auth/v1/token?grant_type=password", {
        method: "POST",
        headers:{
			'apikey': pass,
			'Content-Type': "application/json"
		},
		body: JSON.stringify({email: mail, password: wordPass})
    });

    const data = await response.json();

    if(!response.ok){
        alert("Ошибка входа: " + data.error_description);
    }else{
        alert("Вход прошел успешно");
        localStorage.setItem("supabaseToken", data.access_token);
        auth.style.display = "none";
        trecker.style.display = "flex"
        loadTasks()
    }


    email.value = "";
    password.value = "";
});


button.addEventListener("click", async function(){
	if (input.value == ""){	
		input.placeholder = "Сначало нужно что-то написать!"
		
	}
	else{
	    input.placeholder = "Введите задачу сюда..."
		await fetch(URL, {
			method: 'POST',
			headers:{
				'apikey': pass,
				'Authorization': "Bearer " + localStorage.getItem("supabaseToken"),
				'Content-Type': "application/json"
			},
			body: JSON.stringify({"title": input.value})
		});

		input.value = "";

        tasks.innerHTML = "";
		loadTasks()
	}
});

async function loadTasks(){
    loader.style.display = "flex";
    tasks.innerHTML = "";
    const response = await fetch(URL, {
        method: "GET",
        headers:{
            'apikey': pass,
		    'Authorization': "Bearer " + localStorage.getItem("supabaseToken"),
		    'Content-Type': "application/json"
        }
    });

    const data = await response.json();

    if (data.length === 0){
        const notYet = document.createElement("h3")
        notYet.textContent = "Список задач пуст 😥"
        tasks.appendChild(notYet)
    }else{
        data.forEach(tas => {
            const task = document.createElement("p");
            if(tas.status == 1){
                task.style.textDecoration = "line-through"
            }
            task.classList.add("task-item");
            const del = document.createElement("button");
            task.addEventListener("click", async function(){
                const newyURL = URL + "?id=eq." + tas.id;
                await fetch(newyURL, {
                    method: "PATCH",
                    headers:{
                        'apikey': pass,
                        'Authorization': "Bearer " + localStorage.getItem("supabaseToken"),
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ status: 1})
                });

                task.style.textDecoration = "line-through";
            });

            del.textContent = "Удалить";
            del.style.border = "none";
            del.addEventListener("click", async function(){
                const newURL = URL + "?title=eq." + tas.title;
                await fetch(newURL, {
                    method: "DELETE",
                    headers:{
                        'apikey': pass,
                        'Authorization': "Bearer " + pass,
                        'Content-Type': "application/json"
                    }
                });

                task.remove();
                if (tasks.children.length === 0){
                    const notYet = document.createElement("h3")
                    notYet.textContent = "Список задач пуст 😥"
                    tasks.appendChild(notYet)
                }
            });

            task.textContent = tas.title;
            task.appendChild(del);
            tasks.appendChild(task);
        });
    }
    loader.style.display = "none";
};

loadTasks();