<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
	// Index page
    public function indexAction()
    {
        return $this->render('WebMainBundle:Default:index.html.twig');
    }

    // Map page
    public function mapAction()
    {
    	return $this->render('WebMainBundle:Default:map.html.twig');
    }
}
