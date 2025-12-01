
function showToast(type, title, message, duration) {
  let container = document.getElementById('global-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none';
    document.body.appendChild(container);
  }
  const colors = {
    success: {
      bg: 'bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-700 dark:to-teal-900',
      border: 'border-teal-500',
      icon: '<ion-icon name="checkmark-circle-outline" class="text-teal-100 dark:text-teal-300 w-7 h-7"></ion-icon>'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-700 dark:to-yellow-900',
      border: 'border-yellow-500',
      icon: '<ion-icon name="warning-outline" class="text-yellow-100 dark:text-yellow-300 w-7 h-7"></ion-icon>'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-red-700 dark:from-red-700 dark:to-red-900',
      border: 'border-red-500',
      icon: '<ion-icon name="close-circle-outline" class="text-red-100 dark:text-red-300 w-7 h-7"></ion-icon>'
    }
  };
  const c = colors[type] || colors.success;
  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border-2 ${c.bg} ${c.border} animate-toast-in pointer-events-auto min-w-[260px] max-w-[360px]`;
  toast.innerHTML = `
    <div>${c.icon}</div>
    <div class="flex flex-col">
      <span class="text-base font-semibold text-white dark:text-gray-100">${title}</span>
      <span class="text-sm text-white dark:text-gray-200">${message}</span>
    </div>
    <style>
      @keyframes toast-in { from { opacity: 0; transform: translateY(-30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes toast-out { to { opacity: 0; transform: translateY(-10px) scale(0.97); } }
      .animate-toast-in { animation: toast-in 0.35s cubic-bezier(.4,.2,.2,1); }
      .animate-toast-out { animation: toast-out 0.4s forwards; }
    </style>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('animate-toast-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, (duration || 2) * 1000);
}

function successDialog(title, message, duration) {
  showToast('success', title, message, duration);
}

function warningDialog(title, message, duration) {
  showToast('warning', title, message, duration);
}

function errorDialog(title, message, duration) {
  showToast('error', title, message, duration);
}

async function searchCnpj(cnpj) {
  if (!cnpj || cnpj.length !== 14) return null;
  const token = '9XcvqzppSv5e0AE3DfUeXnILPi06x6AoHGgNUkiR6QID';
  const url = `https://comercial.cnpj.ws/cnpj/${cnpj}?token=${token}`;

  const res = await fetch(url);

  if (res.status != 200) return null;

  // Verifica se não encontrou.
  const cnpjData = await res.json();
  return cnpjData;
}

function phoneFormat(ddd, telefone) {
  return (ddd && telefone) ? `${ddd}${telefone}` : '';
}
function faxFormat(dddFax, fax) {
  return (dddFax && fax) ? `${dddFax}${fax}` : '';
}


function getActiveStateRegistrationBySate(stateRegistrations, stateAbbr) {
  if (!Array.isArray(stateRegistrations)) return '';
  const stateRegistration = stateRegistrations.find(
    ie => ie.ativo === true && ie.estado && ie.estado.sigla === stateAbbr
  );
  return stateRegistration ? stateRegistration.inscricao_estadual : '';
}

function cpfMask(cpf) {
  return cpf
    .replace(/\D/g, '')                // só números
    .replace(/(\d{3})(\d)/, '$1.$2')   // 000.000
    .replace(/(\d{3})(\d)/, '$1.$2')   // 000.000.000
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // 000.000.000-00
}

function cnpjMask(cnpj) {
  return cnpj
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function phoneMask(value) {
  let v = value.replace(/\D/g, ""); // só números

  if (v.length === 11) {
    // Celular com 9 dígitos
    return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
  } else if (v.length === 10) {
    // Telefone fixo (ou celular antigo)
    return v.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
  } else {
    return v;
  }
}

function brazilCurrencyFormat(input) {
  input.addEventListener('input', function (e) {
    // Remove tudo que não for número ou vírgula
    let value = this.value.replace(/[^\d,]/g, '');

    // Substitui múltiplas vírgulas por uma só
    let partes = value.split(',');
    if (partes.length > 2) {
      value = partes[0] + ',' + partes.slice(1).join('');
    }

    // Remove zeros à esquerda
    value = value.replace(/^0+(\d)/, '$1');

    // Formata milhar com ponto
    let [inteiro, decimal] = value.split(',');
    if (inteiro) {
      inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    this.value = decimal !== undefined ? inteiro + ',' + decimal : inteiro;
  });
}

function cepMask(cep) {
  return cep
    .replace(/\D/g, '')              // só números
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2'); // 00000-000
}

function getOptionValueByText(selectId, text) {
  const select = document.getElementById(selectId);
  for (const option of select.options) {
    if (option.text.trim() === text.trim()) {
      return option.value;
    }
  }
  return null; 
}

async function searchCep(cep) {
  if (!cep || cep.length !== 8) {
    return null;
  }
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (!data.erro) {
      const ibge = data.ibge || '';
      let city = {};
      if (ibge) {
        try {
          const res = await fetch(`/api/city-ibge/${ibge}`);
          city = await res.json();
          city = city[0] || {};
          if (city) {
            return {
              streetName: data.logradouro || '',
              neighborhood: data.bairro || '',
              cityId: city.nnumerocidad || '',
              city: city.cnomecidad || '',
              state: city.cnomeestad || '',
              stateId: city.nnumeroestad || '',
              state_abbr: city.cufestad || '',
              countryId: city.nnumeropais || '',
              country: 'BRASIL',
              complement: data.complemento || ''
            };
          }
        } catch (e) {
          city = {};
        }
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

function renderLoading(text = "Carregando...") {
  removeLoading(); 
  const overlay = document.createElement("div");
  overlay.id = "global-loading-overlay";
  overlay.className = "fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 animate-fade-in";
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
    <div class="relative flex flex-col items-center justify-center gap-4">
        <div class="hourglass-loader">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="hourglass-svg">
            <defs>
              <linearGradient id="glassBody" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
                <stop stop-color="#e0f2fe" stop-opacity="0.7"/>
                <stop offset="1" stop-color="#0f172a" stop-opacity="0.2"/>
              </linearGradient>
              <linearGradient id="sandColor" x1="32" y1="20" x2="32" y2="44" gradientUnits="userSpaceOnUse">
                <stop stop-color="#fde68a"/>
                <stop offset="1" stop-color="#fbbf24"/>
              </linearGradient>
            </defs>
            <!-- Corpo da ampulheta -->
            <path d="M20 8 Q32 28 44 8 Q44 12 32 32 Q44 52 44 56 Q32 36 20 56 Q20 52 32 32 Q20 12 20 8 Z" fill="url(#glassBody)" stroke="#14b8a6" stroke-width="2"/>
            <!-- Topo arredondado -->
            <ellipse cx="32" cy="8" rx="12" ry="3.5" fill="#14b8a6" opacity="0.18"/>
            <!-- Areia topo (triângulo) -->
            <polygon class="sand-top" points="24,12 40,12 32,28" fill="url(#sandColor)"/>
            <!-- Areia fluindo -->
            <rect class="sand-flow" x="31" y="28" width="2" height="10" rx="1" fill="#fde68a"/>
            <!-- Areia base (triângulo invertido) -->
            <polygon class="sand-bottom" points="24,52 40,52 32,36" fill="url(#sandColor)"/>
            <!-- Reflexo vidro -->
            <path d="M26 14 Q32 32 38 14" stroke="#fff" stroke-width="1.2" opacity="0.18" fill="none"/>
          </svg>
        </div>
      <span class="text-lg font-semibold text-teal-200">${text}</span>
      <span class="text-base text-teal-100/80">Aguarde, estamos processando...</span>
    </div>
    <style>
      .hourglass-loader {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hourglass-svg {
        display: block;
        animation: hourglass-rotate 2.8s cubic-bezier(.4,.2,.2,1) infinite;
      }
      .sand-top {
        animation: sand-top-flow 1.4s linear infinite;
        transform-origin: 32px 20px;
      }
      .sand-bottom {
        animation: sand-bottom-fill 1.4s linear infinite;
        transform-origin: 32px 44px;
      }
      .sand-flow {
        animation: sand-flow-drop 1.4s linear infinite;
        transform-origin: 32px 32px;
      }
      @keyframes sand-top-flow {
        0% { opacity: 1; }
        80% { opacity: 0.2; }
        100% { opacity: 0; }
      }
      @keyframes sand-bottom-fill {
        0% { opacity: 0; }
        20% { opacity: 0.2; }
        100% { opacity: 1; }
      }
      @keyframes sand-flow-drop {
        0% { opacity: 1; height: 10px; }
        80% { opacity: 0.2; height: 2px; }
        100% { opacity: 0; height: 0px; }
      }
      @keyframes hourglass-rotate {
        0% { transform: rotate(0deg); }
        90% { transform: rotate(0deg); }
        100% { transform: rotate(180deg); }
      }
      @keyframes fadeOutLoading { to { opacity: 0; } }
      .animate-fade-in { animation: fadeInLoading 0.3s; }
      @keyframes fadeInLoading { from { opacity: 0; } to { opacity: 1; } }
    </style>
  `;
  document.body.appendChild(overlay);
}

function removeLoading() {
  const overlay = document.getElementById("global-loading-overlay");
  if (overlay) {
    overlay.style.animation = "fadeOutLoading 0.4s forwards";
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 400);
  }
}

async function sleepSeconds(seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function setYesNoCheckbox(checkboxId, value) {
  const checkbox = document.getElementById(checkboxId);
  if (checkbox) {
    checkbox.checked = (value === 'S');
  }
}

function activeInactiveCheckbox(checkboxId, value) {
  const checkbox = document.getElementById(checkboxId);
  if (checkbox) {
    checkbox.checked = (value === 'A');
  }
}

function fillSelect(selectElement, data, valueField, labelField, defaultOption = 'Selecione', defaultValue = '') {
  if (!selectElement) return;
  selectElement.innerHTML = '';
  if (defaultOption !== null) {
    const opt = document.createElement('option');
    opt.value = defaultValue;
    opt.textContent = defaultOption;
    selectElement.appendChild(opt);
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item[valueField];
      opt.textContent = item[labelField];
      selectElement.appendChild(opt);
    });
  }
}


// debounce to limit rapid function calls
function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}

function refreshCachePage(idInput) {
  const input = document.getElementById(idInput);
  if (input) {
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }
}

function decodeBase64(str) {
    try {
        return decodeURIComponent(escape(window.atob(str)));
    } catch {
        return '';
    }
}

// Build payload from form fields
function buildPayloadFromForm(fieldsMap) {
    const base = {};
    fieldsMap.forEach(([inputId, key]) => {
        const el = document.getElementById(inputId);
        base[key] = (el && el.value !== '') ? el.value : null;
    });
    return base;
}

// Handle API exceptions and show dialogs
function handleApiExceptions(title, result) {
    if (result.warning_message) {
        warningDialog(title, result.warning_message, 5);
    } else if (result.error_message) {
        errorDialog(title, result.error_message , 5);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pkIsReferenced(pkValue, pkName, tableName) {
    const response = await fetch(
        `/api/pk-is-referenced?pk_value=${pkValue}&pk_name=${pkName}&table_name=${tableName}`
    );

    const data = await response.json();
    return data.is_referenced; 
}

function onlyNumbersInput(inputElement) {
    inputElement.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
}

function handleMaxLength(input, max_length) {
    input.addEventListener("keydown", (e) => {
        if (!e.key) return;
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

        if (
            ((input.value.length) 
            - (input.selectionEnd - input.selectionStart) + 1)
            > max_length
        ) {
            e.preventDefault();
            warningDialog('Limite de Caracteres', `Tamanho máximo de ${max_length} caracteres.`, 5);
        }
    }); 
}

function getStatusBadge(status, primary_color) {
    if (status === 'A') {
        return `<span class='text-sm font-medium px-2.5 py-1 rounded-sm bg-${primary_color}-700 text-${primary_color}-100'>ATIVO</span>`;
    } else {
        return `<span class='text-sm font-medium px-2.5 py-1 rounded-sm bg-red-700 text-red-100'>INATIVO</span>`;
    }
}