class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for (let i = 1; i <= id; i++) {

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if (despesa === null) {
				continue
			}

			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa) {

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()

		//ano
		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}


		return despesasFiltradas

	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)


	if (despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}




	/*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

	let listaDespesas = document.getElementById("listaDespesas")
	let total = 0
	listaDespesas.innerHTML = ''

	//Caso não tenha retorno na pesquisa
	if (despesas.length == 0 && filtro == true) {
		//Criando a linha (tr)		
		let linha = listaDespesas.insertRow();
		let t_d1 = linha.insertCell(0)
		t_d1.colSpan = '5'
		t_d1.style = 'text-align:center;'
		t_d1.innerHTML = 'Nenhum registro encontrado'

		//Criando a linha (tr)		
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i> Limpar pesquisa'
		btn.onclick = function () {
			window.location.reload()
		}
		var linha2 = listaDespesas.insertRow();
		let t_d2 = linha2.insertCell(0);
		t_d2.colSpan = '5';
		t_d2.style = 'text-align: center;'
		t_d2.append(btn)
	}

	despesas.forEach(function (d) {

		//Criando a linha (tr)
		let linha = listaDespesas.insertRow();
		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		//Ajustar o tipo
		switch (d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break

		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criar o botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function () {

			document.getElementById('modal_titulo').innerHTML = `Excluir <strong><em>${d.descricao}</em></strong> no valor de <em><strong>${d.valor}</strong></em> ?`
			document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
			document.getElementById('modal_conteudo').innerHTML = 'Deseja realmente excluir esse item? (Essa ação não poderá ser desfeita!)'
			document.getElementById('modal_btn_cancela').innerHTML = 'Cancelar e Voltar'
			document.getElementById('modal_btn_cancela').className = 'btn btn-danger'
			document.getElementById('modal_btn_confirma').innerHTML = 'Confirmar e Excluir'
			document.getElementById('modal_btn_confirma').className = 'btn btn-success'
			let id = this.id.replace('id_despesa_', '')
			document.getElementById('modal_btn_confirma').onclick = function () {
				bd.remover(id)
				window.location.reload()
			}
			//dialog de erro
			$('#modalRegistraDespesa').modal('show')

		}
		linha.insertCell(4).append(btn)
		total += parseFloat(d.valor.replace('.', '').replace(',', '.'))
	})

	let linha = listaDespesas.insertRow();
	let label_total = linha.insertCell(0)
	label_total.colSpan = '3'
	label_total.style = 'text-align:center; text-transform: uppercase; font-weight: bold;'
	label_total.innerHTML = 'Total:'

	let td_total = linha.insertCell(1)
	td_total.colSpan = '2'
	td_total.style = 'text-align:center; text-transform: uppercase; font-weight: bold;'
	td_total.innerHTML = floatParaDinheiro(total)

}

// funções de comparação para a função SORT()
function ordenaData(a, b) {
	if (a.ano != b.ano)
		return a.ano > b.ano ? 1 : -1;
	else if (a.mes != b.mes)
		return a.mes > b.mes ? 1 : -1;
	else if (a.dia != b.dia)
		return a.dia > b.dia ? 1 : -1;
	else
		return 0;
}

function ordenaValor(a, b) {
	let a_valor = a.valor.replace('.', '').replace(',', '.');
	let b_valor = b.valor.replace('.', '').replace(',', '.');

	if (a_valor != b_valor)
		return a_valor > b_valor ? 1 : -1;
	else return 0
}

function ordenaAlfabeto(a, b) {
	
	if (a.toUpperCase() != b.toUpperCase())
		return a > b ? 1 : -1;
	else
		return 0
}

function ordenaTipo(a, b) {
	return ordenaAlfabeto(a.tipo, b.tipo);
}


function pesquisarDespesa(campo = null, ordem = null) {

	let ano = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	// ordena a lista de acordo com o parametro ordem e campo
	if (ordem == null)
		this.carregaListaDespesas(despesas, true);
	else {
		let ordenado = null;
		switch (campo) {
			case 'data':
				ordenado = despesas.sort(ordenaData)
				break;
			case 'value':
				ordenado = despesas.sort(ordenaValor)
				break;
			case 'type':
				ordenado = despesas.sort(ordenaTipo)
				break;
			default:
				ordenado = despesas;
				break;
		}
		if (ordem == 'decrescent')
			ordenado = ordenado.reverse()
		this.carregaListaDespesas(ordenado, true);
	}
}

function floatParaDinheiro(valor) {
	$('body').append($('<input>', { style: 'display: none;', id: 'input_masked' }));
	$("#input_masked").val(valor.toFixed(2).replace('.', ''))
	$("#input_masked").mask("#.##0,00", { reverse: true });

	let masked = $("#input_masked").val()

	$("#input_masked").remove()

	return masked;

}

/* SETANDO dias em cada mes de cada ano */

let getDaysInMonth = function(month,year) {
   return new Date(year, month, 0).getDate();
};

function qtdDias() {
	let ano = $('#ano').val()
	let mes = $('#mes').val()
	let dias = getDaysInMonth(mes, ano)
	let dia = $('#dia')
	dia.empty()
	dia.append('<option disabled selected>Dia</option>')
	for (let d = 1; d <= dias ; d++) {
		let opt =  document.createElement('option')
		if (d <= 9){
			d = '0' + d
		}
		opt.setAttribute('value', d)
		opt.innerText = d
		dia.append(opt)
	}
	
}

$(document).ready(function(){
	$('#ano').on('change', qtdDias);
	$('#mes').on('change', qtdDias);
})
