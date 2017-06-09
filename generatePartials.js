const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const svgDir = './black/svg/';
const partialsDir = './partials/';

fs.readdir(svgDir, (err, files) => {
	if (err) {
		return console.log(err);
	}

	files.forEach(file =>  {
		const filename = svgDir + file;
		const name = path.basename(filename, path.extname(filename));
		const newFilename = partialsDir + name + '.html';
		//console.log(name, filename, newFilename);
		fs.readFile(filename, (err, data) => {
			if (err) {
				return console.log(err);
			}
			data = String(data).replace('<?xml version="1.0" encoding="utf-8"?>\n', '');
			//console.log(String(data));
			$ = cheerio.load(data, {
		    xmlMode: true
			});
			$('svg')
				.attr('id', name)
				.attr('fill', 'currentcolor')
				.removeAttr('width')
				.removeAttr('height');
			data = $.html();
			data = `{{- $id := "${name}" -}}
{{- $name := add "icon-" $id -}}
{{- if not (.Scratch.Get $name) -}}
{{- .Scratch.Set $name true -}}
<svg class="clip" xmlns="http://www.w3.org/2000/svg" width="0" height="0">
<defs>
${data}
</defs>
</svg>
{{- end }}`
			//console.log(String(data));
			fs.writeFile(newFilename, data, err => {
				if (err) {
					return console.log(err);
				}
				console.log('Written ' + newFilename);
			});
		});
	})
});