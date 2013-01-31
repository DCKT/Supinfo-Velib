<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Web\MainBundle\Entity\Favoris;
use Symfony\Component\HttpFoundation\Response;

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
        // Current user
        $user = $this->container->get('security.context')->getToken()->getUser();
       
        $repo = $this->getDoctrine()->getManager()->getRepository('WebMainBundle:Favoris');

        $favoris = $repo->getUserFavori($user);

        return $this->render('WebMainBundle:Default:favoris.html.twig', array(
             'favoris' => $favoris
        ));
    }

    public function addFavoriAction()
    {
        return new Response('Yo');
    }
}
