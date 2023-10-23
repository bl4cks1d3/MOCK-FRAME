function analisarCopybook() {
    var copybookFile = document.getElementById("copybookFile").files[0];

    if (copybookFile) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var copybookContent = e.target.result;
            var resultados = analisarLinhasCopybook(copybookContent);
            exibirResultados(resultados);
        };

        reader.readAsText(copybookFile);
    } else {
        alert("Selecione um arquivo Copybook COBOL.");
    }
}

function analisarLinhasCopybook(copybookContent) {
    var regexNivel = /(\d{2})\s+(\w+)-(.*)\.\n/g;
    var nivelMatches;
    var resultados = [];

    while ((nivelMatches = regexNivel.exec(copybookContent)) !== null) {
        
        var nivel = parseInt(nivelMatches[1]);
        var linha = nivelMatches[2].trim();

        var campo = criarCampo(nivel, linha);
        var tipo = determinarTipo(linha);
        var tamanho = determinarTamanho(linha);
        var value = determinarValue(linha);
        var comp = determinarComp(linha);

        campo.tipo = tipo;
        campo.tamanho = tamanho;
        campo.value = value;
        campo.comp = comp;

        resultados.push(campo);
    }

    return resultados;
}

function criarCampo(nivel, linha) {
    return {
        level: nivel,
        nome: linha,
        tipo: '',
        tamanho: '',
        value: '',
        comp: ''
    };
}

function determinarTipo(linha) {
    if (linha.includes('OCCURS')) {
        return 'OCCURS';
    } else if (linha.includes('REDEFINES')) {
        return 'REDEFINES';
    } else if (linha.includes('PIC')) {
        var regexTipo = /PIC\s+(.*?)(\(|\s)/;
        var tipoMatches = regexTipo.exec(linha);
        if (tipoMatches) {
            return tipoMatches[1].trim();
        }
    }

    return '';
}

function determinarTamanho(linha) {
    var regexTamanho = /\((\d+)\)/;
    var tamanhoMatches = regexTamanho.exec(linha);
    if (tamanhoMatches) {
        return tamanhoMatches[1].trim();
    }

    return '';
}

function determinarValue(linha) {
    if (linha.includes('VALUE')) {
        if (linha.includes('VALUE ALL')) {
            return 'VALUE ALL';
        } else if (linha.includes('VALUE')) {
            return 'VALUE';
        }
    } else if (linha.includes('SPACES')) {
        return 'SPACES';
    }

    return '';
}

function determinarComp(linha) {
    if (linha.includes('COMP-5')) {
        return 'COMP-5';
    } else if (linha.includes('COMP-4')) {
        return 'COMP-4';
    } else if (linha.includes('COMP-3')) {
        return 'COMP-3';
    } else if (linha.includes('COMP-2')) {
        return 'COMP-2';
    } else if (linha.includes('COMP-1')) {
        return 'COMP-1';
    } else if (linha.includes('COMP')) {
        return 'COMP';
    }

    return '';
}

function exibirResultados(resultados) {
    var resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    if (resultados.length === 0) {
        resultadoDiv.innerHTML = '<p>Nenhum campo encontrado.</p>';
        return;
    }

    var table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    var thead = document.createElement('thead');
    var trHead = document.createElement('tr');
    var headers = ['Level', 'Campo', 'Tipo', 'Tamanho', 'Value', 'Comp'];

    for (var i = 0; i < headers.length; i++) {
        var th = document.createElement('th');
        th.scope = 'col';
        th.textContent = headers[i];
        trHead.appendChild(th);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    for (var j = 0; j < resultados.length; j++) {
        var campo = resultados[j];

        var tr = document.createElement('tr');
        var tdLevel = document.createElement('td');
        tdLevel.textContent = campo.level;

        var tdCampo = document.createElement('td');
        tdCampo.textContent = campo.nome;

        var tdTipo = document.createElement('td');
        tdTipo.textContent = campo.tipo;

        var tdTamanho = document.createElement('td');
        tdTamanho.textContent = campo.tamanho;

        var tdValue = document.createElement('td');
        tdValue.textContent = campo.value;

        var tdComp = document.createElement('td');
        tdComp.textContent = campo.comp;

        tr.appendChild(tdLevel);
        tr.appendChild(tdCampo);
        tr.appendChild(tdTipo);
        tr.appendChild(tdTamanho);
        tr.appendChild(tdValue);
        tr.appendChild(tdComp);

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    resultadoDiv.appendChild(table);
}
