<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
	// Page d'accueil
    public function indexAction()
    {
        return $this->render('WebMainBundle:Default:index.html.twig');
    }

    // Page avec GMAP
    public function mapAction()
    {
    	return $this->render('WebMainBundle:Default:map.html.twig');
    }

    // Page avec favoris
    public function favorisAction()
    {
        return $this->render('WebMainBundle:Default:favoris.html.twig');
    }
}
