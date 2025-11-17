import { Component } from 'inferno';
import { Link } from 'inferno-router';
import FormField from './FormField';
import SecretField from './SecretField';
import { LuCircleAlert, LuInfo } from './Icons';
import { apiFetch, regex, session } from '../utils';
import '../styles/AuthForm.css';

export default class AuthForm extends Component {
  state={fields:this.props.fields.map(n=>({name:n,value:'',error:''})),show:false,loading:false};

  v=(n,v)=>{
    const s=this.state.fields.find(f=>f.name==='secret')?.value;
    return(
      (n==='name'   &&!regex.name.test(v)    &&'invalid name') ||
      (n==='userid' &&!(regex.mobile.test(v)||regex.email.test(v)) &&'invalid userid') ||
      (n==='mobile' &&!regex.mobile.test(v)  &&'invalid mobile') ||
      (n==='email'  &&!regex.email.test(v)   &&'invalid email') ||
      (n==='secret' &&!regex.secret.test(v)  &&'invalid secret') || ''
    );
  };

  modal=(m,c='orangered',I=LuCircleAlert)=>this.props.dispatch({type:'setModal',value:{on:true,msg:m,icon:<I size={32} color={c}/>}});

  onInput=e=>{
    const {name,value}=e.target;
    this.setState({fields:this.state.fields.map(f=>f.name===name?{...f,value,error:this.v(name,value)}:f)});
  };

  forgot=async e=>{
    const u=e.target.form.userid?.value.trim();
    if(!u) return this.modal('enter email or mobile');
    try{
      const r=await apiFetch('/api/v1/auth/reset',{method:'POST',body:{userid:u}});
      if(!r.ok) throw new Error(r.data?.error);
      this.modal('Reset link sent','teal',LuInfo);
    }catch(x){this.modal(x.message);}
  };

  submit=async e=>{
    e.preventDefault(); this.setState({loading:true});
    const bad=this.state.fields.find(f=>f.error);
    if(bad) return this.setState({loading:false},()=>this.modal(bad.error));

    const b={}; this.state.fields.forEach(f=>b[f.name]=f.value);
    b.token=new URLSearchParams(this.props.location.search).get('token') || '';
    const {mode}=this.props, r=await apiFetch(
        `/api/v1/auth/${mode==='reset'?'confirm':mode}`,
        {method:'POST',body:b}
      );
    this.setState({loading:false});
    if(!r.ok) return this.modal(r.data.error);

    if(mode==='signup'){
      this.modal('Account created','teal',LuInfo);
      return this.props.history.push('/auth/login');
    }
    if(mode==='reset'){
      this.modal('Secret updated','teal',LuInfo);
      return this.props.history.push('/auth/login');
    }
    session.set(r.data.accessToken); session.set(r.data.user,'User');
    this.props.history.push('/');
  };

  F=f=>{
    const M={
      name:['Name','text','Full Name'],
      userid:['UserId','text','email or mobile'],
      mobile:['Mobile','tel','254X-XX-XXX-XXX'],
      email:['Email','email','user@org.com']
    }[f.name];

    return(f.name==='secret')
      ?<SecretField key={f.name}{...f}label='Secret'placeholder='enter secret'
        show={this.state.show}onToggle={()=>this.setState({show:!this.state.show})}onInput={this.onInput}/>
      :<FormField key={f.name}{...f}label={M[0]}type={M[1]}placeholder={M[2]}onInput={this.onInput}/>;
  };

  render(){
    const {mode,fields}=this.props, s=mode==='signup', r=mode==='reset';
    return(
      <div class="form-container">
        <div class="form-wrapper">
          <div class="logo"><h1 class="title">KopaPath</h1><small class="slogan">Future is now!</small></div>

          <form onSubmit={this.submit}>
            {this.state.fields.map(this.F)}

            {!r &&
              <small class="cta">
                {s?<>Have an account? <Link to="/auth/login">Login</Link></>
                   :<>New here? <Link to="/auth/signup">Signup</Link></>}
              </small>
            }

            <div class="submit">
              {!s&&!r&&<button type="button" class="btn-forgot-secret" onClick={this.forgot}>Forgot Secret?</button>}
              {r&&<Link className='login' to='/auth/login'>Login</Link>}
              <button class="btn-submit" disabled={this.state.loading}>
                {s?'Signup':r?'Reset':'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}