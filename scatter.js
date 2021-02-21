
let margin = {top: 10, right: 30, bottom: 30, left: 60}

let width = 500 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let x = d3.scaleLinear()
	.domain([0, 3000])
	.range([ 0, width ]);

let y = d3.scaleLinear()
	.domain([0, 1])
	.range([height, 0]);


let csv = null; //to be used for data later
const unique = (value, index, self) => self.indexOf(value) === index; 

d3.csv("all_results_norm.csv", d => {
	csv = d; 
	const unique = (value, index, self) => self.indexOf(value) === index; 
	const games = d.map(x => x.Game).filter(unique);
	//populate dropdown
	d3.select("#dropdown")
		.selectAll("games")
		.data(games)
		.enter()
		.append("option")
			.attr("value", d => d)
			.html(d => d)
	d3.select("#dropdown")
		.on("change", draw)

	draw()
})

const draw = () => {
	//this next bit is hacky, should find a way to use enter/exit
	let prev = document.querySelector("svg")
	if (prev) {
		prev.remove()
	}
	const game = document.getElementById("dropdown").value;
	console.log(game)
	const data = csv.filter(d => d.Game == game)
	
	let svg = d3.select("#main")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
	// Add X axis
	svg.append("g")
		.attr("transform", `translate(0,${ height })`)
		.call(d3.axisBottom(x));

	// Add Y axis
	svg.append("g")
		.call(d3.axisLeft(y));
	svg.append('g')
		.selectAll("dot")
		.data(data)
		.enter()
		.append("a")
			.attr("href", 
				d => {
					let base = "https://www.kmjn.org/temp/ale2/"
					let game = d.Game;
					let depth = d["Rollout depth"]
					let limit = d["Turn limit"]
					let time = d["Time limit"].substring(1)
					let skip = d.Frameskip
					return `${base + game}_depth${depth}_limit${limit}_time${time}_skip${skip}.mp4`
				})
			.append("circle")
				.attr("cx", d => x(+d["Rollout depth"]) )
				.attr("cy", d => y(+d["Time limit"]) )
				.attr("r", d => 2*d["Normscore"] + 2)
				.style("fill", "#69b3a2")
}







