package com.cts.cors;
 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;
 
import reactor.core.publisher.Mono;
 
@Configuration
 
@EnableWebFluxSecurity
 
public class CorsGlobalConfiguration {
 
    @Bean
 
    public CorsWebFilter corsWebFilter() {
 
        CorsConfiguration corsConfig = new CorsConfiguration();
 
        corsConfig.setAllowCredentials(true);
 
        corsConfig.addAllowedOriginPattern("*");
 
        corsConfig.addAllowedHeader("*");
 
        corsConfig.addAllowedMethod("*");
 
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
 
        source.registerCorsConfiguration("/**", corsConfig);
 
        return new CorsWebFilter(source);
 
    }
 
    @Bean
 
    @Order(Ordered.HIGHEST_PRECEDENCE)
 
    public WebFilter corsFilter() {
 
        return (exchange, chain) -> {
 
            ServerHttpRequest request = exchange.getRequest();
 
            if (CorsUtils.isCorsRequest(request)) {
 
                ServerHttpResponse response = exchange.getResponse();
 
                HttpHeaders headers = response.getHeaders();
 
                headers.add("Access-Control-Allow-Origin", "http://localhost:4200");
 
                headers.add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
 
                headers.add("Access-Control-Allow-Headers", "*");
 
                headers.add("Access-Control-Allow-Credentials", "true");
 
                if (request.getMethod() == HttpMethod.OPTIONS) {
 
                    response.setStatusCode(HttpStatus.OK);
 
                    return Mono.empty();
 
                }
 
            }
 
            return chain.filter(exchange);
 
        };
 
    }
 
}