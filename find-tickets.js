const _ = require('lodash');
const rp = require('request-promise');
const env = require('node-env-file');
const qs = require('querystring');
const Promise = require('bluebird');
const moment = require('moment');

env(__dirname + '/.env');

const MAX_PULL_REQUESTS_FETCH = 5;

const BASE_URL = "https://api.github.com/repos/" + process.env.GITHUB_USER + "/" + process.env.GITHUB_REPO + "/pulls";
const ACCESS_TOKEN = "&access_token=" + process.env.GITHUB_OAUTH_TOKEN; 

function buildUrl (strPath, oParams) {
	return BASE_URL + strPath + "?" + qs.stringify(oParams) + ACCESS_TOKEN;
}

function getItem (strPath, oParams) {
	const url = buildUrl(strPath, oParams);
	//console.log("Fetching: ", url);
	return rp({ uri : url, headers: { 'user-agent' : 'node.js' } })
		.then(function (body) {
			return JSON.parse(body);
		})
		.catch(function (err) {
			console.log("FAILED REQUEST: ", url);
			console.log(err);
		});
}

console.log("Fetching Pull Requests");

getItem("", { state : 'closed', base : 'master' })
	.then(function (pullRequests) {
		const limitedPullRequests = _.map(pullRequests, function (pr) {
			if (pr.merged_at !== null) return pr;
		}).slice(0, MAX_PULL_REQUESTS_FETCH);

		let pullRequestResultData = [];

		const fetchPullRequestCommits = _.map(limitedPullRequests, function (pullRequest) {
			return getItem("/" + pullRequest.number + "/commits", { })
				.then(function (pullRequestCommits) {
					return {
						data : pullRequest,
						commits : pullRequestCommits,
					};
				});
		});

		Promise.all(fetchPullRequestCommits)
			.then(function (results) {
				console.log('Pull Requests Fetched!');
				console.log('');

				_.each(results, function (pr) {
					let matches = [];
					let badCommits = [];
					_.each(pr.commits, function (commit) {
						const message = _.get(commit, 'commit.message');
						const commitMatches = message.match(/[A-Za-z]+-[0-9]+/g) || [];

						if (commitMatches.length > 0) {
							matches = matches.concat(commitMatches);
						} else {
							badCommits.push(message);
						}
					});

					const tickets = (matches) ? _.uniq(matches).sort(function (a, b) {
						var aParts = a.split('-');
						var bParts = b.split('-');

						var aName = aParts[0];
						var bName = bParts[0];

						if (aName !== bName) return aName > bName;

						var aNum = parseInt(aParts[1]);
						var bNum = parseInt(bParts[1]);

						return aNum > bNum;
					}) : [];

					console.log('Release: ', pr.data.title);
					console.log('When: ', moment().to(pr.data.merged_at));
					console.log('Tickets: ', (tickets.length) ? tickets.join(', ') : '(none)');

					if (badCommits.length > 0) {
						console.log("Ticketless Commits: ");
						_.each(badCommits, function (message) {
							console.log("  -- ", message);
						});
					}

					console.log('');
				});
			});
	});
