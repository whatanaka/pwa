let cacheName = 'notes-son.v.1.0.0';
//Para que o site rode offline
let filesToCache = [
    './',
    'index.html',
    'css/colors.css',
    'css/styles.css',
    'js/array.observe.polyfill.js',
    'js/object.observe.polyfill.js',
    'js/scripts.js',
    'service-worker.js'
];

self.addEventListener('install',function(e){
    console.log('[ServiceWorker] Installer');
    //e = evento
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

//Retira o cache antigo ou que nao tem haver com o cache corrent, somente do dominio que
//Caso haja algum tipo de mudanca no cache, uma renovacao de lista de arquivos por exemplo
self.addEventListener('activate',function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList){
            return Promise.all(keyList.map(function(key){
                if(key!==cacheName){
                    console.log('[ServiceWorker] Removing old cache',key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

//Cada url que for chamado esta logica procura no cache e traz o conteudo caso ele encontre
self.addEventListener('fetch',function(e){
    console.log('[ServiceWorker] Fetch',e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    );
});