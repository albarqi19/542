// تحديد عناصر DOM
const nameInput = document.getElementById('nameInput');
const addNameButton = document.getElementById('addNameButton');
const nameList = document.getElementById('nameList');
const pickRandomButton = document.getElementById('pickRandomButton');
const result = document.getElementById('result');
const resultContainer = document.getElementById('resultContainer');
const namesCount = document.getElementById('namesCount');
const currentYear = document.getElementById('currentYear');
const clearAllButton = document.getElementById('clearAll');
const importButton = document.getElementById('importNames');
const exportButton = document.getElementById('exportNames');
const importModal = document.getElementById('importModal');
const confirmImport = document.getElementById('confirmImport');
const importText = document.getElementById('importText');
const closeBtn = document.querySelector('.close-btn');

// أزرار تغيير المظهر
const defaultThemeBtn = document.getElementById('theme-default');
const darkThemeBtn = document.getElementById('theme-dark');
const lightThemeBtn = document.getElementById('theme-light');

// قائمة الأسماء
let names = [];

// حفظ وإستعادة البيانات من التخزين المحلي
function saveNamesToLocalStorage() {
    localStorage.setItem('randomNamePickerNames', JSON.stringify(names));
}

function loadNamesFromLocalStorage() {
    const savedNames = localStorage.getItem('randomNamePickerNames');
    if (savedNames) {
        names = JSON.parse(savedNames);
        updateNamesList();
    }
}

// حفظ وإستعادة السمة من التخزين المحلي
function saveTheme(theme) {
    localStorage.setItem('randomNamePickerTheme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('randomNamePickerTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}

// تحديث عرض قائمة الأسماء
function updateNamesList() {
    nameList.innerHTML = '';
    names.forEach((name, index) => {
        const listItem = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'حذف الاسم';
        deleteBtn.addEventListener('click', () => {
            deleteName(index);
        });
        
        listItem.appendChild(nameSpan);
        listItem.appendChild(deleteBtn);
        nameList.appendChild(listItem);
        
        // تأثير الدخول
        setTimeout(() => {
            listItem.style.opacity = '1';
            listItem.style.transform = 'translateX(0)';
        }, 50 * index);
    });
    
    // تحديث عدد الأسماء
    namesCount.textContent = names.length;
}

// إضافة اسم جديد
function addName() {
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        saveNamesToLocalStorage();
        updateNamesList();
        nameInput.value = '';
        nameInput.focus();
    }
}

// حذف اسم
function deleteName(index) {
    const listItem = nameList.children[index];
    
    // تأثير الخروج
    listItem.style.opacity = '0';
    listItem.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        names.splice(index, 1);
        saveNamesToLocalStorage();
        updateNamesList();
    }, 300);
}

// حذف جميع الأسماء
function clearAllNames() {
    if (names.length === 0) return;
    
    if (confirm('هل أنت متأكد من حذف جميع الأسماء؟')) {
        names = [];
        saveNamesToLocalStorage();
        updateNamesList();
        hideResult();
    }
}

// اختيار اسم عشوائي
function pickRandomName() {
    if (names.length === 0) {
        alert('لا توجد أسماء للاختيار منها!');
        return;
    }
    
    // إظهار كونتينر النتيجة
    resultContainer.classList.remove('hidden');
    
    // إخفاء النص وإظهار الدوران
    result.style.opacity = '0';
    document.querySelector('.spinner').style.display = 'block';
    
    // تمرير وقت قبل إظهار النتيجة (للتأثير)
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        result.textContent = `${names[randomIndex]}`;
        
        // إخفاء الدوران وإظهار النص
        document.querySelector('.spinner').style.display = 'none';
        result.style.opacity = '1';
        
        // تشغيل تأثير الكونفيتي
        launchConfetti();
        
        // إضاءة الاسم في القائمة
        highlightNameInList(randomIndex);
    }, 1000);
}

// إخفاء النتيجة
function hideResult() {
    resultContainer.classList.add('hidden');
}

// إضاءة الاسم في القائمة
function highlightNameInList(index) {
    const listItems = nameList.querySelectorAll('li');
    
    // إزالة الإضاءة من جميع العناصر
    listItems.forEach(item => {
        item.style.backgroundColor = '';
    });
    
    // إضاءة العنصر المحدد إذا كان موجوداً
    if (listItems[index]) {
        listItems[index].style.animation = 'highlight 2s ease';
        
        // تمرير إلى العنصر
        listItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// تشغيل تأثير الكونفيتي
function launchConfetti() {
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
    });
}

// استيراد أسماء
function importNames() {
    importModal.classList.remove('hidden');
    importModal.classList.add('show');
    importText.focus();
}

// تأكيد استيراد الأسماء
function confirmImportNames() {
    const text = importText.value.trim();
    if (text) {
        const importedNames = text.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (importedNames.length > 0) {
            if (confirm(`سيتم إضافة ${importedNames.length} اسم. هل أنت متأكد؟`)) {
                names = [...names, ...importedNames];
                saveNamesToLocalStorage();
                updateNamesList();
                closeImportModal();
            }
        }
    }
}

// إغلاق نافذة الاستيراد
function closeImportModal() {
    importModal.classList.remove('show');
    setTimeout(() => {
        importModal.classList.add('hidden');
        importText.value = '';
    }, 300);
}

// تصدير الأسماء
function exportNames() {
    if (names.length === 0) {
        alert('لا توجد أسماء للتصدير!');
        return;
    }
    
    const text = names.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'قائمة الأسماء.txt';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// تطبيق السمة
function applyTheme(theme) {
    // إزالة الثيمات السابقة
    document.body.classList.remove('theme-dark', 'theme-light');
    
    // إزالة التنشيط من جميع الأزرار
    defaultThemeBtn.classList.remove('active');
    darkThemeBtn.classList.remove('active');
    lightThemeBtn.classList.remove('active');
    
    // تطبيق الثيم الجديد
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
        darkThemeBtn.classList.add('active');
    } else if (theme === 'light') {
        document.body.classList.add('theme-light');
        lightThemeBtn.classList.add('active');
    } else {
        defaultThemeBtn.classList.add('active');
    }
    
    // حفظ الثيم
    saveTheme(theme);
}

// أحداث التطبيق
addNameButton.addEventListener('click', addName);
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addName();
});
pickRandomButton.addEventListener('click', pickRandomName);
clearAllButton.addEventListener('click', clearAllNames);
importButton.addEventListener('click', importNames);
exportButton.addEventListener('click', exportNames);
confirmImport.addEventListener('click', confirmImportNames);
closeBtn.addEventListener('click', closeImportModal);

// أحداث تغيير السمة
defaultThemeBtn.addEventListener('click', () => applyTheme('default'));
darkThemeBtn.addEventListener('click', () => applyTheme('dark'));
lightThemeBtn.addEventListener('click', () => applyTheme('light'));

// إقفال النافذة المنبثقة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === importModal) {
        closeImportModal();
    }
});

// تحديث السنة الحالية
currentYear.textContent = new Date().getFullYear();

// تحميل الأسماء والسمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadNamesFromLocalStorage();
    loadTheme();
});