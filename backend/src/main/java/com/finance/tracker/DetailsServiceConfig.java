package com.finance.tracker;
import org.springframework.context.annotation.*;import org.springframework.security.core.userdetails.*;import org.springframework.security.core.userdetails.UsernameNotFoundException;
@Configuration public class DetailsServiceConfig {
 @Bean UserDetailsService userDetailsService(Users users){return email->{User u=users.findByEmailIgnoreCase(email).orElseThrow(()->new UsernameNotFoundException("User not found"));return org.springframework.security.core.userdetails.User.withUsername(u.email).password(u.passwordHash).roles("USER").build();};}
 @Bean org.springframework.security.authentication.AuthenticationManager authenticationManager(org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration c)throws Exception{return c.getAuthenticationManager();}
}
