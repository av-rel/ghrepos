document.querySelector("form").onsubmit = async function(e) {
	e.preventDefault()

	let pre = new Date()
	let uname = document.querySelector("[name=\"uname\"]").value
	let repos = await ghUserRepos(uname)
	let now = new Date()

	document.getElementById("ctr").innerText = repos.length
	document.getElementById("speed").innerText = `Time taken: ${(now - pre)/1000}s`

	let ul = document.getElementById("list")

	let li = []

	repos.forEach(repo => {
		let l = document.createElement("li")
		l.innerText = repo
		li.push(l)
	})
	ul.innerText = ""
	li.forEach(e => ul.appendChild(e))
}
