
import { html } from "htm/preact";

import { filesize } from './opfs-global.js';
import { tree, treeRed } from './opfs-global.js';
import { upath, upathRed } from './opfs-global.js';

function Tree(props) {
	console.log('Tree', props);
	const entries = props.entries ?? tree.value;

	const top_path = props.top_path;
	const sub_path = props.sub_path ?? [];
	const str_path = '/'+top_path.join('/');

	const open_directory = (dirname) => {
		console.log('sub_path', sub_path);
		if(dirname=='..' && top_path.length!==0) {
			let path = [...top_path];
			path.pop();
			upath.value = path;
		} else {
			let path = [...top_path, ...sub_path];
			path.push(dirname);
			upath.value = path;
		}
	};

	const remEntry = (entry, evt) => {
		evt.preventDefault();
		treeRed.remEntry(entry.id);
	};

	const go_home = () => {
		upath.value = [];
	};

//	[ ${ top_path.join('/') } | ${ sub_path.join('/') } ]
	return html`
		${ props.is_top ? html`<h1><span class="ico ico_home" onClick=${go_home}></span>${str_path}</h1>` : ''}
		${ entries.length ? html`
			<div class="entries">
				${ props.is_top && upath.value.length!==0 ? html`
					<div class="row dir">
						<span class="ico ico_dir"></span>
						<span class="cell name" onClick=${() => open_directory('..')}>..</span>
						<span class="cell size"></span>
						<span class="cell dt"  ></span>
						<span class="cell act" ></span>
					</div>
				` : ''}
				${entries.map(entry => {
					if(entry.kind=='d') {
						return html`<div class="row dir">
							<span class="ico ico_dir"></span>
							<span class="cell name" onClick=${() => open_directory(entry.name)}>${entry.name}</span>
							<span class="cell size"></span>
							<span class="cell dt"  ></span>
							<span class="cell act" ><span onClick=${remEntry.bind(null, entry)}>rem</span></span>
						</div><div class="row sub">
							<${Tree} is_top=${false} top_path=${top_path} sub_path=${[...sub_path, entry.name]} entries=${entry.entries} />
						</div>`;
					}
					if(entry.kind=='f') {
						return html`<div class="row file">
							<span class="ico ico_fle"></span>
							<span class="cell name">${entry.name}</span>
							${filesize(entry.size)}
							<span class="cell dt"  >${entry.dts}</span>
							<span class="cell act" ><span onClick=${remEntry.bind(null, entry)}>rem</span></span>
						</div>`;
					}
				})}
			</div>
		` : html`
			<div class="entries">
				${ props.is_top && upath.value.length!==0 ? html`
					<div class="row dir">
						<span onClick=${() => open_directory('..')}>..</span>
						<span></span>
						<span></span>
						<span class="cell act"></span>
					</div>
				` : ''}
				<p class="empty">Empty folder</p>
			</div>
		` }
	`;
}

export default Tree;
