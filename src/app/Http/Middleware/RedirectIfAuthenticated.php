<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {   
        if(Auth::guard($guard)->check() && Auth::user()->isDisable()){
            //return something saying user cant access the website
        }
        
        if(Auth::guard($guard)->check() && Auth::user()->isAdmin()){
            return redirect()->action('AdminController@showAdminPage', Auth::user()->username);
        }

        if (Auth::guard($guard)->check()){
            return redirect()->action('User\UserController@showProfile',Auth::user()->username);
        }
        return $next($request);
    }
}
