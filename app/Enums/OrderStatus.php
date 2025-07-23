<?php

namespace App\Enums;

enum OrderStatus: string
{
    case CREATED = 'CREATED';
    case SENT = 'SENT';
    case DONE = 'DONE';
    case ERROR = 'ERROR';
}
