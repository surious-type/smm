<?php

namespace App\Enums;

enum TaskStatus: string
{
    case CREATED = 'CREATED';
    case STARTED = 'STARTED';
    case DONE = 'DONE';
    case ERROR = 'ERROR';
}
