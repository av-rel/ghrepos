/*	Source: https://github.com/av-rel/ghrepos
 *	Use: ghUserRepos(username) to get repolist for user or ghOrgRepos(orgname) to get repolist for org.
 *	NOTE: 
 *		Functions (ghUserReposNoProxy) may not work if github cors error is occured
 *		It doesnot uses api but web scraping means
 *		Feel free to use
 */

var __corsproxyurl = "https://corsproxy.org/?"

async function ghUserRepos(user) {
	var url = __corsproxyurl.concat(__user2url(user));
	return (await __ghRepoList(url, false))
}

async function ghOrgRepos(org) {	//This might not show all repos due to diff html attr used by github
	var url = __corsproxyurl.concat(__org2url(org));
	return (await __ghRepoList(url, true))
}

async function ghUserReposNoProxy(user) {
	return (await __ghRepoList(__user2url(user), false))
}

async function ghOrgReposNoProxy(org) {
	return (await __ghRepoList(__org2url(org), true))
}

function __user2url(user) {
	return encodeURIComponent(`https://github.com/${user}?tab=repositories`);
}

function __org2url(org) {
	return encodeURIComponent(`https://github.com/orgs/${org}/repositories`);
}

async function __ghRepoList(url, isOrg) {
	var r = await __repoStats(url)

	for (let i = 1; i < r.pages; i++) {
		var ur = url.concat((isOrg ? "?" : "&").concat("page=".concat((i+1).toString())))
		var nxtList = (await __repoStats(ur)).list
		r.list = r.list.concat(nxtList)
	}

	return r.list;
}

async function __repoStats(url) {
	var page = await (await fetch(url)).text();
	var gh = document.createElement("div");
	gh.innerHTML = page

	var nRepos = Number(gh.querySelectorAll('span.Counter')[0]["title"])
	var pList = Object.values(gh.querySelectorAll('[itemprop="name codeRepository"]')).map(a => a["href"])
	var nPages = Math.ceil(nRepos / pList.length);
	var list = __ghNamesFromList(pList)

	return {list : list, pages : nPages};
}

function __ghNamesFromList(urlList) {
	return urlList.map((url => __ghNameFromUrl(url)));
}

function __ghNameFromUrl(url) {
	var l = url.split("/")
	return l[l.length - 1];
}
