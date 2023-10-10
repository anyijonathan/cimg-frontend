import React from 'react'
import {routes, adminRoutes, superAdminRoutes} from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import {useSelector} from "react-redux"

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent() {

  // Get data from redux store
  let userRoleState = useSelector((state) => {
    return state["auth"]
  })

  let {userRole} = userRoleState

  let role = userRole
  return (
      <div className="w-72 py-4 h-full bg-primary-color text-white-color font-circular-std">
        <div className='w-full flex items-center pr-6'>
          <Icons.FcmbLogo className = 'w-1/3' />
          <h3 className='w-2/3 font-medium text-black-primary'>Vendor Switch</h3>
        </div>

    {role === "maker" &&
      <ul className="mt-14">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="sidebar relative w-full pb-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center pl-6 w-full h-12 text-sm font-semibold transition-colors duration-150"
                activeClassName="text-white bg-[linear-gradient(89.92deg,_#60088C_0.07%,_#A11E90_92.22%)]"
              >
               
                <Icon className="w-5 h-5 fill-black-secondary" aria-hidden="true" icon={route.icon} />
                <span className="ml-4 font-medium">{route.name}</span>
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute right-0 w-1 h-12 text-black-secondary bg-purple-primary"
                    aria-hidden="true"
                  ></span>
                </Route>
              </NavLink>
            </li>
          )
        )}
      </ul>
    }

    {role === "checker" &&
      <ul className="mt-14">
      {adminRoutes.map((route) =>
        route.adminRoutes ? (
          <SidebarSubmenu route={route} key={route.name} />
        ) : (
          <li className="sidebar relative w-full pb-3" key={route.name}>
            <NavLink
              exact
              to={route.path}
              className="inline-flex items-center pl-6 w-full h-12 text-sm font-semibold transition-colors duration-150"
              activeClassName="text-white bg-[linear-gradient(89.92deg,_#60088C_0.07%,_#A11E90_92.22%)]"
            >
             
              <Icon className="w-5 h-5 fill-black-secondary" aria-hidden="true" icon={route.icon} />
              <span className="ml-4 font-medium">{route.name}</span>
              <Route path={route.path} exact={route.exact}>
                <span
                  className="absolute right-0 w-1 h-12 text-black-secondary bg-purple-primary"
                  aria-hidden="true"
                ></span>
              </Route>
            </NavLink>
          </li>
        )
      )}
    </ul> 
   
   }

{role === "superAdmin" &&
      <ul className="mt-14">
      {superAdminRoutes.map((route) =>
        route.adminRoutes ? (
          <SidebarSubmenu route={route} key={route.name} />
        ) : (
          <li className="sidebar relative w-full pb-3" key={route.name}>
            <NavLink
              exact
              to={route.path}
              className="inline-flex items-center pl-6 w-full h-12 text-sm font-semibold transition-colors duration-150"
              activeClassName="text-white bg-[linear-gradient(89.92deg,_#60088C_0.07%,_#A11E90_92.22%)]"
            >
             
              <Icon className="w-5 h-5 fill-black-secondary" aria-hidden="true" icon={route.icon} />
              <span className="ml-4 font-medium">{route.name}</span>
              <Route path={route.path} exact={route.exact}>
                <span
                  className="absolute right-0 w-1 h-12 text-black-secondary bg-purple-primary"
                  aria-hidden="true"
                ></span>
              </Route>
            </NavLink>
          </li>
        )
      )}
    </ul> 
   
   }




    </div>
  )
}

export default SidebarContent
