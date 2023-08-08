
import { html } from "htm/preact";

import { list, listRed } from './opfs-global.js';
import { search_query } from './opfs-global.js';

function List(props) {
	console.log('List', props);
	const entries = props.entries.value;

	return html`
		${ props.is_top ? html`<h1>${search_query}</h1>` : ''}
		${ entries.length ? html`
			<div class="entries">
				${entries.map(entry => {
					if(false && entry.kind=='d') {
						return html`<div class="row dir">
							<span onClick=${() => open_directory(entry.name)}>${entry.name}</span>
							<span></span>
							<span></span>
							<span class="cell act" ></span>
						</div><div class="row sub">
							<${Tree} is_top=${false} top_path=${top_path} sub_path=${[...sub_path, entry.name]} entries=${entry.entries} />
						</div>`;
					}
					if(entry.kind=='f') {
						return html`<div class="row file">
							<span class="cell name">/${entry.path.join('/')}/${entry.name}</span>
							<span class="cell size">${entry.size}</span>
							<span class="cell dt"  >${entry.dts}</span>
							<span class="cell act" ></span>
						</div>`;
					}
				})}
			</div>
		` : html`
			<div class="entries">
				<p>Listado vacio</p>
			</div>
		` }
	`;
}

export default List;
