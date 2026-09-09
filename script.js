const products=[
{id:1,name:'Business Suit',price:45000,cat:'Women',img:'assets/nov1.png'},
{id:2,name:'Tank Top and Joggers',price:95000,cat:'Men',img:'assets/nov5.png'},
{id:3,name:'Male Two Piece',price:72000,cat:'Men',img:'assets/nov2.png'},
{id:4,name:'Nova Polo',price:46000,cat:'Men',img:'assets/nov4.png'},
{id:5,name:'Women cooperate set',price:68000,cat:'Women',img:'assets/nov6.png'},
{id:7,name:'Cooperate Gown',price:32000,cat:'Women',img:'assets/nov7.png'},
{id:8,name:'Nova crop button shirt',price:22000,cat:'Men',img:'assets/nov8.png'},
{id:9,name:'Nova crop  shirt',price:22000,cat:'Men',img:'assets/nov9.png'},
{id:10,name:'Nova crop  Hoodie',price:25000,cat:'Women',img:'assets/nov10.png'},
{id:11,name:'Nova Jacket',price:75000,cat:'Unisex',img:'assets/nov11.png'},
{id:12,name:'long sleeve',price:12000,cat:'Women',img:'assets/nov12.png'},
{id:13,name:'Nova sweatshirt',price:25000,cat:'Unisex',img:'assets/nov14.png'},
{id:15,name:'Nova Two Piece',price:45000,cat:'Men',img:'assets/nov15.png'},
{id:14,name:'Evening Gown',price:35000,cat:'Women',img:'assets/nov16.png'},
{id:6,name:'Nova Hoodie',price:82000,cat:'Unisex',img:'assets/nova-hoodie.png'}];

let cartItems=[];
let current=products[0];
let wishlist=[];
let currentList=products;
let currentUser=JSON.parse(localStorage.getItem('novara_user')||'null');
let authMode='login';
const money=n=>'₦'+n.toLocaleString();

function card(p){
    const liked=wishlist.includes(p.id);
    return `<article class="card"><div class="pic" onclick="openProduct(${p.id})"><img src="${p.img}" alt="${p.name}"><button class="heart ${liked?'liked':''}" onclick="event.stopPropagation();toggleWish(${p.id})"><i data-lucide="heart" ${liked?'fill="currentColor"':''}></i></button></div><div class="meta"><div><h3>${p.name}</h3><p>${p.cat}</p></div><strong>${money(p.price)}</strong></div><button class="add" onclick="add(${p.id})">Add to bag <span>↗</span></button></article>`
}

function render(list=products){
    currentList=list;
    document.getElementById('featured').innerHTML=list.slice(0,4).map(card).join('');
    document.getElementById('shopgrid').innerHTML=list.map(card).join('');
    document.getElementById('shown').textContent=`Showing ${list.length} pieces`;
    lucide.createIcons();
}

function filter(cat,el){
    document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('selected'));
    el.classList.add('selected');
    render(cat==='All'?products:products.filter(p=>p.cat===cat));
}

function go(id){
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('show'));
    document.getElementById(id).classList.add('show');
    document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('active',x.dataset.nav===id));
    window.scrollTo({top:0,behavior:'smooth'});
    lucide.createIcons();
}

function openProduct(id){
    current=products.find(p=>p.id===id)||products[0];
    document.getElementById('pname').textContent=current.name;
    document.getElementById('pprice').textContent=money(current.price);
    document.getElementById('pimg1').src=current.img;
    document.getElementById('pimg2').src=current.img;
    document.getElementById('sizes').innerHTML=['XS','S','M','L','XL'].map((s,i)=>`<button class="${i===2?'sel':''}" onclick="this.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));this.classList.add('sel')">${s}</button>`).join('');
    closeSearch();
    go('product');
}

function add(id){
    const p=products.find(x=>x.id===id);
    const found=cartItems.find(x=>x.id===id);
    found?found.qty++:cartItems.push({...p,qty:1});
    updateCart();
    openCart();
}

function addCurrent(){add(current.id)}

function change(id,d){
    const x=cartItems.find(x=>x.id===id);
    if(!x)return;
    x.qty+=d;
    if(x.qty<=0)cartItems=cartItems.filter(x=>x.id!==id);
    updateCart();
}

function updateCart(){
    const qty=cartItems.reduce((s,x)=>s+x.qty,0);
    document.getElementById('count').textContent=qty;
    document.getElementById('count').style.display=qty?'grid':'none';
    document.getElementById('cartNum').textContent=qty;
    document.getElementById('cartItems').innerHTML=cartItems.length?cartItems.map(x=>`<div class="cart-item"><img src="${x.img}"><div><h3>${x.name}</h3><p>${money(x.price)}</p><div class="qty"><button onclick="change(${x.id},-1)"><i data-lucide="minus"></i></button><span>${x.qty}</span><button onclick="change(${x.id},1)"><i data-lucide="plus"></i></button><button class="remove" onclick="change(${x.id},-${x.qty})"><i data-lucide="trash-2"></i></button></div></div></div>`).join(''):`<div class="empty">Your bag is empty.<button onclick="closeCart();go('shop')">Continue shopping</button></div>`;
    document.getElementById('total').textContent=money(cartItems.reduce((s,x)=>s+x.price*x.qty,0));
    lucide.createIcons();
}

function openCart(){
    document.getElementById('cart').classList.add('show');
    document.getElementById('cartBg').classList.add('show');
    updateCart();
}

function closeCart(){
    document.getElementById('cart').classList.remove('show');
    document.getElementById('cartBg').classList.remove('show');
}

function toggleMenu(){
    document.getElementById('mobileNav').classList.toggle('show');
    document.getElementById('menuBg').classList.toggle('show');
}

function openSearch(){
    document.getElementById('searchPanel').classList.add('show');
    document.getElementById('searchBg').classList.add('show');
    document.getElementById('searchInput').value='';
    document.getElementById('searchResults').innerHTML='';
    setTimeout(()=>document.getElementById('searchInput').focus(),200);
}

function closeSearch(){
    document.getElementById('searchPanel').classList.remove('show');
    document.getElementById('searchBg').classList.remove('show');
}

function doSearch(q){
    q=q.trim().toLowerCase();
    const box=document.getElementById('searchResults');
    if(!q){box.innerHTML='';return}
    const results=products.filter(p=>p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));
    box.innerHTML=results.length?results.map(card).join(''):`<div class="search-empty">No pieces found for "${q}"</div>`;
    lucide.createIcons();
}

function toggleWish(id){
    wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
    updateWishBadge();
    render(currentList);
    if(document.getElementById('searchResults').innerHTML) doSearch(document.getElementById('searchInput').value);
}

function updateWishBadge(){
    document.getElementById('wishCount').textContent=wishlist.length;
    document.getElementById('wishCount').style.display=wishlist.length?'grid':'none';
    document.getElementById('wishNum').textContent=wishlist.length;
}

function renderWishItems(){
    const items=products.filter(p=>wishlist.includes(p.id));
    document.getElementById('wishItems').innerHTML=items.length?items.map(p=>`<div class="cart-item"><img src="${p.img}"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty"><button onclick="add(${p.id});">Add to bag</button><button class="remove" onclick="toggleWish(${p.id});renderWishItems()"><i data-lucide="trash-2"></i></button></div></div></div>`).join(''):`<div class="empty">Nothing saved yet.<button onclick="closeWishlist();go('shop')">Continue shopping</button></div>`;
    lucide.createIcons();
}

function openWishlist(){
    document.getElementById('wishlist').classList.add('show');
    document.getElementById('wishBg').classList.add('show');
    renderWishItems();
}

function closeWishlist(){
    document.getElementById('wishlist').classList.remove('show');
    document.getElementById('wishBg').classList.remove('show');
}

// ---- Login / accounts ----
function openLogin(mode='login',prefillEmail=''){
    if(currentUser){openAccount();return}
    document.getElementById('loginBg').classList.add('show');
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('authEmail').value=prefillEmail;
    document.getElementById('authPassword').value='';
    switchAuthTab(mode);
}

function closeLogin(){
    document.getElementById('loginBg').classList.remove('show');
    document.getElementById('loginModal').classList.remove('show');
}

function switchAuthTab(mode){
    authMode=mode;
    document.getElementById('tabLogin').classList.toggle('sel',mode==='login');
    document.getElementById('tabSignup').classList.toggle('sel',mode==='signup');
    document.getElementById('loginEyebrow').textContent=mode==='login'?'WELCOME BACK':'JOIN NOVARA';
    document.getElementById('loginTitle').textContent=mode==='login'?'Log in to NOVARA':'Create your account';
    document.getElementById('authSubmit').innerHTML=mode==='login'?'Log in <span>↗</span>':'Sign up <span>↗</span>';
    document.getElementById('authError').textContent='';
}

function handleAuth(e){
    e.preventDefault();
    const email=document.getElementById('authEmail').value.trim().toLowerCase();
    const password=document.getElementById('authPassword').value;
    const errBox=document.getElementById('authError');
    const users=JSON.parse(localStorage.getItem('novara_users')||'[]');

    if(authMode==='signup'){
        if(users.find(u=>u.email===email)){errBox.textContent='An account with this email already exists.';return}
        users.push({email,password});
        localStorage.setItem('novara_users',JSON.stringify(users));
        currentUser={email};
    } else {
        const match=users.find(u=>u.email===email && u.password===password);
        if(!match){errBox.textContent='Incorrect email or password.';return}
        currentUser={email};
    }
    localStorage.setItem('novara_user',JSON.stringify(currentUser));
    closeLogin();
    updateAccountUI();
}
emailjs.init('CfuyOPJ2M49EGonAC');
function updateAccountUI(){
    document.querySelector('.account').classList.toggle('logged',!!currentUser);
}

function openAccount(){
    document.getElementById('accountEmail').textContent=currentUser.email;
    document.getElementById('accountBg').classList.add('show');
    document.getElementById('accountPanel').classList.add('show');
}

function closeAccount(){
    document.getElementById('accountBg').classList.remove('show');
    document.getElementById('accountPanel').classList.remove('show');
}

function logout(){
    currentUser=null;
    localStorage.removeItem('novara_user');
    updateAccountUI();
    closeAccount();
}

function handleNewsletterSubmit(form){
    const email=form.querySelector('input[type=email]').value;
    openLogin('signup',email);
}

function startCheckout(){
    if(!cartItems.length){alert('Your bag is empty.');return}
    if(!currentUser){closeCart();openLogin('login');return}
    closeCart();
    document.getElementById('ckEmail').value=currentUser.email;
    renderCheckoutSummary();
    go('checkout');
}

function renderCheckoutSummary(){
    document.getElementById('checkoutItems').innerHTML=cartItems.map(x=>`<div class="ck-item"><img src="${x.img}"><div><h3>${x.name}</h3><p>${x.qty} × ${money(x.price)}</p></div><strong>${money(x.price*x.qty)}</strong></div>`).join('');
    const subtotal=cartItems.reduce((s,x)=>s+x.price*x.qty,0);
    const shipping=subtotal>=50000||subtotal===0?0:3500;
    document.getElementById('ckSubtotal').textContent=money(subtotal);
    document.getElementById('ckShipping').textContent=shipping?money(shipping):'Free';
    document.getElementById('ckTotal').textContent=money(subtotal+shipping);
}

function placeOrder(e){
    e.preventDefault();
    const name=document.getElementById('ckName').value;
    const email=document.getElementById('ckEmail').value;
    const orderId='NV-'+Math.floor(100000+Math.random()*900000);
    const subtotal=cartItems.reduce((s,x)=>s+x.price*x.qty,0);
    const shipping=subtotal>=50000?0:3500;
    const itemsText=cartItems.map(x=>`${x.name} × ${x.qty} — ${money(x.price*x.qty)}`).join('\n');

    const submitBtn=document.querySelector('#checkoutForm button[type=submit]');
    submitBtn.disabled=true;
    submitBtn.innerHTML='Placing order...';

    emailjs.send("service_u6abbym","template_2oambr6",{
        to_name:name,
        to_email:email,
        order_id:orderId,
        order_items:itemsText,
        order_subtotal:money(subtotal),
        order_shipping:shipping?money(shipping):'Free',
        order_total:money(subtotal+shipping)
    }).then(()=>{
        document.getElementById('confirmName').textContent=', '+name.split(' ')[0];
        document.getElementById('confirmEmail').textContent=email;
        document.getElementById('confirmId').textContent='#'+orderId;
        cartItems=[];
        updateCart();
        document.getElementById('checkoutForm').reset();
        submitBtn.disabled=false;
        submitBtn.innerHTML='Place order <span>↗</span>';
        go('confirmation');
    }).catch(err=>{
        console.error('EmailJS error:',err);
        submitBtn.disabled=false;
        submitBtn.innerHTML='Place order <span>↗</span>';
        alert('Something went wrong sending your confirmation. Please try again.');
    });
}


render();
updateCart();
updateAccountUI();
lucide.createIcons();