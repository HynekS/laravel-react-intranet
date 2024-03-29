<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="description" content="project management app">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="format-detection" content="telephone=no">
    <link rel="prefetch" href="Detail.js" as="script">
    <link rel="prefetch" href="TableProvider.js" as="script">
    <link rel="prefetch" href="vendors~TableProvider.js" as="script">
    <link rel="prefetch" href="vendors~TableProvider.js" as="script">
    <link rel="shortcut icon" href="{{ URL::asset('/images/favicons/favicon.ico') }}">
    <link rel="icon" type="image/png" href="{{ URL::asset('/images/favicons/favicon-32x32.png') }}" type="image/x-icon" />
    <title>Project management app</title>
</head>

<body>
    <noscript>
        You need to enable JavaScript to run this app.
    </noscript>
    <div id="app"></div>
    <script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
</body>

</html>