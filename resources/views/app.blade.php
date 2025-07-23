<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="icon" href="/favicon.ico" sizes="64x64">
    <title>App</title>
    {{--    <link rel="icon" href="/public/favicon.svg" sizes="any" type="image/svg+xml">--}}
    {{--    <link rel="apple-touch-icon" href="/public/apple-touch-icon-180x180.png" sizes="180x180">--}}
    @viteReactRefresh
    @vite('src/main.tsx')
</head>
<body class="antialiased">
<div id="app"></div>
</body>
</html>
